export default {
  template: `
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid d-flex justify-content-between">
        
        <!-- Centered when not logged in -->
        <div v-if="!authState.isLoggedIn" class="d-flex w-100 justify-content-center">
          <i class="bi bi-controller text-white fs-3 me-2"></i>
          <a class="navbar-brand text-center" href="#">Lawless Gaming</a>
        </div>

        <!-- Left-aligned when logged in -->
        <div v-else class="d-flex align-items-center">
          <i class="bi bi-controller text-white fs-3 me-2"></i>
          <a class="navbar-brand" href="#">Lawless Gaming</a>
        </div>

        <button v-if="authState.isLoggedIn" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li v-if="authState.isLoggedIn" class="nav-item">
              <span class="nav-link text-white font-weight-bold">
                {{ authState.username }}
              </span>
            </li>
            <li v-if="authState.isLoggedIn" class="nav-item">
              <a class="nav-link text-white" href="#" @click="logout">Logout</a>
            </li>
          </ul>
        </div>

      </div>
   </nav>
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
    },
    goToLogin() {
      this.$root.changeView('login');
    }
  }
};
