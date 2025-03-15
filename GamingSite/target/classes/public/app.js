const app = Vue.createApp({
	data() {
		const jwt = localStorage.getItem('jwt');
		let role = localStorage.getItem('role') || '';
		let currentRole = localStorage.getItem('currentRole') || '';

		if (!currentRole && role) {
			currentRole = role;
			localStorage.setItem('currentRole', currentRole);
		}

		let defaultView = 'login';

		if (jwt) {
			defaultView = currentRole === 'ADMIN' ? 'data_import' : 'data_import';
		}
		if (jwt) {
			defaultView = currentRole === 'USER' ? 'flappyBird' : 'user_dashboard';
		}


		return {
			currentView: defaultView,
			role,
			currentRole
		};
	},

	methods: {
		changeView(newView) {
			this.currentView = newView;
		},

		changeRole(newRole) {
			authState.currentRole = newRole;
			localStorage.setItem('currentRole', newRole);
			this.updateViewBasedOnRole(newRole);
			loadRestrictedComponents().then(() => {
				this.$forceUpdate();
			});
		},

		updateViewBasedOnRole(role) {
			this.currentView = role === 'ADMIN' ? 'data_import' : 'user_dashboard';
		}
	}
});

const authState = Vue.reactive({
	isLoggedIn: !!localStorage.getItem('jwt'),
	username: localStorage.getItem('username') || '',
	role: localStorage.getItem('role') || '',
	currentRole: localStorage.getItem('currentRole') || ''
});
app.provide('authState', authState);

const unrestrictedComponents = [
	"navbar.js",
	"login.js"
];

const restrictedComponentFiles = {
	ADMIN: [
		"admin/data_import.js",
		"admin/register.js",
		"aside_menu.js",
		"games/flappyBird.js",
		"games/aimTrainer.js",
		"games/typeRacer.js",
		"games/memoryMatch.js",
		"games/sudoku.js",
		"games/mathSpeed.js",
		"analytics/stats.js",
		"analytics/leaderboard.js",
		"games/higherOrLower.js",
		"games/guessNumber.js",
		"admin/userComplaintRead.js",
		"analytics/userComplaintWrite.js",
	],
	USER: [
		"user/user_dashboard.js",
		"aside_menu.js",
		"games/flappyBird.js",
		"games/aimTrainer.js",
		"games/typeRacer.js",
		"games/memoryMatch.js",
		"games/sudoku.js",
		"games/mathSpeed.js",
		"analytics/stats.js",
		"analytics/leaderboard.js",
		"games/higherOrLower.js",
		"games/guessNumber.js",
		"analytics/userComplaintWrite.js",
	]
};

async function loadComponent(file, withAuth = false) {
	try {
		const headers = {};
		if (withAuth) {
			const jwt = localStorage.getItem('jwt');
			if (!jwt) return;
			headers['Authorization'] = `Bearer ${jwt}`;
		}
		const response = await fetch(`./components/${file}`, { headers });
		if (!response.ok) throw new Error(`Failed to fetch ${file}`);
		const scriptText = await response.text();
		const blob = new Blob([scriptText], { type: 'application/javascript' });
		const blobUrl = URL.createObjectURL(blob);
		const module = await import(blobUrl);
		URL.revokeObjectURL(blobUrl);
		const componentName = file.split('/').pop().replace(".js", "");
		app.component(componentName, module.default || module);

	} catch (error) {
		console.error(`Error loading component: ${file}`, error);
	}
}

async function loadComponents() {
	for (const file of unrestrictedComponents) {
		await loadComponent(file, false);
	}
	const jwt = localStorage.getItem('jwt');
	const currentRole = localStorage.getItem('currentRole');
	if (jwt && currentRole && restrictedComponentFiles[currentRole]) {
		for (const file of restrictedComponentFiles[currentRole]) {
			await loadComponent(file, true);
		}
	}
	app.mount("#app");
}

async function loadRestrictedComponents() {
	const currentRole = localStorage.getItem('currentRole');
	if (!currentRole || !restrictedComponentFiles[currentRole]) return;
	const jwt = localStorage.getItem('jwt');
	if (!jwt) return;
	for (const file of restrictedComponentFiles[currentRole]) {
		await loadComponent(file, true);
	}
}



loadComponents();
