export default {
  template: `
    <div v-if="authState.isLoggedIn" class="d-flex flex-column border-end bg-light" style="min-height: 100vh;">
      
      <div class="d-flex justify-content-start p-2">
        <button class="btn btn-outline-black" @click="toggleSidebar">
          <i class="bi bi-square-half"></i>
        </button>
      </div>

      <aside :class="['d-flex flex-column p-3', sidebarOpen ? 'w-100' : 'w-auto']" style="min-height: 100vh; width: 100px; transition: width 0.3s;">

        <!-- Admin Functions Section -->
        <div v-if="authState.currentRole === 'ADMIN'">
          <h5 v-if="sidebarOpen" class="text-primary">Admin Functions</h5>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'data_import' ? 'btn-active' : 'btn-secondary']"
                  @click="changeView('data_import')">
            <i class="bi bi-file-earmark-arrow-up"></i>
            <span class="ms-2" v-if="sidebarOpen">Import Data</span>
          </button>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'register' ? 'btn-active' : 'btn-primary']"
                  @click="changeView('register')">
            <i class="bi bi-file-earmark-text"></i>
            <span class="ms-2" v-if="sidebarOpen">Register Users</span>
          </button>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'user_complaints' ? 'btn-active' : 'btn-danger']"
                  @click="changeView('user_complaints')">
            <i class="bi bi-exclamation-triangle"></i>
            <span class="ms-2" v-if="sidebarOpen">User Complaints</span>  
          </button>
        </div>

        <!-- Games Section -->
		<div>
		  <h5 v-if="sidebarOpen" class="text-primary">Games</h5>
		  
		  <h6 v-if="sidebarOpen" class="text-primary">Precision</h6>
		  
		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'flappyBird' ? 'btn-active' : 'btn-success']"
		          @click="changeView('flappyBird')">
		    <i class="bi bi-controller"></i>
		    <span class="ms-2" v-if="sidebarOpen">Flappy Bird</span>
		  </button>

		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'aimTrainer' ? 'btn-active' : 'btn-success']"
		          @click="changeView('aimTrainer')">
		    <i class="bi bi-bullseye"></i>
		    <span class="ms-2" v-if="sidebarOpen">Aim Trainer</span>
		  </button>

		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'geometryDash' ? 'btn-active' : 'btn-success']"
		          @click="changeView('geometryDash')">
		    <i class="bi bi-speedometer2"></i>
		    <span class="ms-2" v-if="sidebarOpen">Geometry Dash</span>
		  </button>

		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'pianoTiles' ? 'btn-active' : 'btn-success']"
		          @click="changeView('pianoTiles')">
		    <i class="bi bi-music-note-list"></i>
		    <span class="ms-2" v-if="sidebarOpen">Piano Tiles</span>
		  </button>
		  
		  <h6 v-if="sidebarOpen" class="text-primary">Puzzles</h6>
		  
		  
		</div>


        <!-- Analytics Section -->
        <div>
          <h5 v-if="sidebarOpen" class="text-primary">Analytics</h5>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'leaderboard' ? 'btn-active' : 'btn-info']"
                  @click="changeView('leaderboard')">
            <i class="bi bi-bar-chart"></i>
            <span class="ms-2" v-if="sidebarOpen">Leaderboard</span>
          </button>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'stats' ? 'btn-active' : 'btn-warning']"
                  @click="changeView('stats')">
            <i class="bi bi-graph-up"></i>
            <span class="ms-2" v-if="sidebarOpen">Stats</span>
          </button>
        </div>

      </aside>
    </div>
  `,
  inject: ['authState'],
  data() {
    return {
      sidebarOpen: true,
      selectedView: ''
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    changeView(view) {
      this.selectedView = view;
      this.$emit('change-view', view);
    }
  }
};
