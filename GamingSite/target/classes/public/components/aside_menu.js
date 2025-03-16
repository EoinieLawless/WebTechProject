export default {
	template: `
    <div v-if="authState.isLoggedIn" class="d-flex flex-column border-end" style="background-color: #2c2f33; color: white; min-height: 100vh; width: 250px; transition: width 0.3s;">

	<br><br>
        <aside class="d-flex flex-column p-3">
            <!-- Admin Functions -->
            <div v-if="authState.currentRole === 'ADMIN'">
                <h5 class="text-light">Admin Functions</h5>
                <button class="btn btn-danger w-100 mb-2 d-flex align-items-center" @click="changeView('data_import')">
                    <i class="bi bi-file-earmark-arrow-up me-2"></i> Import Data
                </button>
                <button class="btn btn-danger w-100 mb-2 d-flex align-items-center" @click="changeView('register')">
                    <i class="bi bi-file-earmark-text me-2"></i> Register Users
                </button>
                <button class="btn btn-danger w-100 mb-2 d-flex align-items-center" @click="changeView('userComplaintRead')">
                    <i class="bi bi-exclamation-triangle me-2"></i> User Complaints
                </button>
            </div>

            <!-- Games Section (Toggle) -->
            <button class="btn btn-primary w-100 text-start mt-3 mb-2" @click="toggleSection">
                Games <i class="bi" :class="gamesOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </button>
            <div v-show="gamesOpen">
                <button class="btn btn-success w-100 mb-1 d-flex align-items-center" @click="changeView('flappyBird')">
                    <i class="bi bi-airplane-fill me-2"></i> Flappy Bird
                </button>
                <button class="btn btn-success w-100 mb-1 d-flex align-items-center" @click="changeView('aimTrainer')">
                    <i class="bi bi-bullseye me-2"></i> Aim Trainer
                </button>
                <button class="btn btn-success w-100 mb-1 d-flex align-items-center" @click="changeView('typeRacer')">
                    <i class="bi bi-lightning me-2"></i> Type Racer
                </button>
                <button class="btn btn-warning w-100 mb-1 d-flex align-items-center" @click="changeView('memoryMatch')">
                    <i class="bi bi-card-heading me-2"></i> Memory Match
                </button>
                <button class="btn btn-warning w-100 mb-1 d-flex align-items-center" @click="changeView('sudoku')">
                    <i class="bi bi-grid me-2"></i> Sudoku Attack
                </button>
                <button class="btn btn-warning w-100 mb-1 d-flex align-items-center" @click="changeView('mathSpeed')">
                    <i class="bi bi-calculator me-2"></i> Speed Math
                </button>
                <button class="btn btn-info w-100 mb-1 d-flex align-items-center" @click="changeView('higherOrLower')">
                    <i class="bi bi-arrow-up me-2"></i> Higher Or Lower
                </button>
                <button class="btn btn-info w-100 mb-1 d-flex align-items-center" @click="changeView('guessNumber')">
                    <i class="bi bi-question-circle me-2"></i> Guess the Number
                </button>
            </div>

            <!-- Analytics -->
            <h5 class="text-light mt-3">Analytics</h5>
            <button class="btn btn-info w-100 mb-2 d-flex align-items-center" @click="changeView('leaderboard')">
                <i class="bi bi-bar-chart me-2"></i> Leaderboard
            </button>
            <button class="btn btn-info w-100 mb-2 d-flex align-items-center" @click="changeView('stats')">
                <i class="bi bi-graph-up me-2"></i> Stats
            </button>
            <button class="btn btn-info w-100 mb-2 d-flex align-items-center" @click="changeView('userComplaintWrite')">
                <i class="bi bi-pencil-square me-2"></i> Post Complaint
            </button>
        </aside>
    </div>
    `,

	inject: ['authState'],

	data() {
		return {
			sidebarOpen: true,
			gamesOpen: false
		};
	},

	methods: {
		toggleSidebar() {
			this.sidebarOpen = !this.sidebarOpen;
		},
		toggleSection() {
			this.gamesOpen = !this.gamesOpen;
		},
		changeView(view) {
			this.$emit('change-view', view);
		}
	}
};
