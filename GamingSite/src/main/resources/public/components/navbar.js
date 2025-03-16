export default {
	template: `
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        
        <!-- Always Centered Logo -->
        <div class="d-flex flex-grow-1 justify-content-center">
          <i class="bi bi-controller text-white fs-3 me-2"></i>
          <a class="navbar-brand text-center" href="#">Lawless Gaming</a>
        </div>

        <!-- Right-aligned user info and logout -->
        <div v-if="authState.isLoggedIn" class="d-flex align-items-center ms-auto">
          <span class="nav-link text-white fw-bold">
            <i class="bi bi-person-circle"></i> {{ authState.username }}
          </span>
          <a class="nav-link text-white ms-3" href="#" @click="logout">
            <i class="bi bi-box-arrow-right"></i> Logout
          </a>
        </div>

      </div>
   </nav>

   <style>
     .navbar {
       height: 60px;
       z-index: 1030;
       width: 100%;
     }
   </style>
  `,

	inject: ['authState'],
	methods: {
		logout() {
			localStorage.removeItem("jwt");
			localStorage.removeItem("username");
			localStorage.removeItem("role");
			localStorage.removeItem("currentRole");
			this.authState.isLoggedIn = false;
			this.authState.username = "";
			this.authState.role = "";
			this.authState.currentRole = "";
			this.$root.changeView('login');
		}
	}
};
