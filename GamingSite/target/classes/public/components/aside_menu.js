export default {
	template: `
	
    <div v-if="authState.isLoggedIn" class="d-flex flex-column border-end bg-light" style="min-height: 100vh;">
	
	<br><br>
      
      <div class="d-flex justify-content-start p-2">
        <button class="btn btn-outline-black" @click="toggleSidebar">
          <i class="bi bi-square-half"></i>
        </button>
      </div>

	  <aside :class="['d-flex flex-column p-3', sidebarOpen ? 'w-100' : 'w-auto']" 
	         style="max-height: 100vh; overflow-y: auto; min-height: 100vh; width: 100px; transition: width 0.3s;">
			 
			 

        <!-- Admin Functions Section -->
        <div v-if="authState.currentRole === 'ADMIN'">
          <h5 v-if="sidebarOpen" class="text-primary">Admin Functions</h5>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'data_import' ? 'btn-active' : 'btn-danger']"
                  @click="changeView('data_import')">
            <i class="bi bi-file-earmark-arrow-up"></i>
            <span class="ms-2" v-if="sidebarOpen">Import Data</span>
          </button>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'register' ? 'btn-active' : 'btn-danger']"
                  @click="changeView('register')">
            <i class="bi bi-file-earmark-text"></i>
            <span class="ms-2" v-if="sidebarOpen">Register Users</span>
          </button>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'userComplaintRead' ? 'btn-active' : 'btn-danger']"
                  @click="changeView('userComplaintRead')">
            <i class="bi bi-exclamation-triangle"></i>
            <span class="ms-2" v-if="sidebarOpen">User Complaints</span>  
          </button>
		  
        </div>

        <!-- Games Section -->
		<div>
		  <h5 v-if="sidebarOpen" class="text-primary">Games</h5>
		  
		  <!-- Precision Section -->
		  
		  <h6 v-if="sidebarOpen" class="text-danger">Precision</h6>
		  
		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'flappyBird' ? 'btn-active' : 'btn-success']"
		          @click="changeView('flappyBird')">
		    <i class="bi bi-airplane-fill"></i>
		    <span class="ms-2" v-if="sidebarOpen">Flappy Bird</span>
		  </button>

		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'aimTrainer' ? 'btn-active' : 'btn-success']"
		          @click="changeView('aimTrainer')">
		    <i class="bi bi-bullseye"></i>
		    <span class="ms-2" v-if="sidebarOpen">Aim Trainer</span>
		  </button>
		  
		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'typeRacer' ? 'btn-active' : 'btn-success']"
		  	          @click="changeView('typeRacer')">
		  	      <i class="bi bi-lightning"></i>
		  	    <span class="ms-2" v-if="sidebarOpen">Type Racer</span>
		  	  </button>
		  
			  
			  <!-- Puzzles Section -->
			  
			  
			  <h6 v-if="sidebarOpen" class="text-danger">Puzzles</h6>

            <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'memoryMatch' ? 'btn-active' : 'btn-warning']"
                    @click="changeView('memoryMatch')">
              <i class="bi bi-card-heading"></i>
              <span class="ms-2" v-if="sidebarOpen">Memory Match</span>
            </button>

            <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'sudoku' ? 'btn-active' : 'btn-warning']"
                    @click="changeView('sudoku')">
              <i class="bi bi-grid"></i>
              <span class="ms-2" v-if="sidebarOpen">Sudoku Attack</span>
            </button>
		  
		  
		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'mathSpeed' ? 'btn-active' : 'btn-warning']"
    	          @click="changeView('mathSpeed')">
    	    <i class="bi bi-calculator"></i>
    	    <span class="ms-2" v-if="sidebarOpen">Speed Math</span>
    	  </button>
		  
		  
		  <!-- Luck-Based Games Section -->
		  		  
          <h6 v-if="sidebarOpen" class="text-info">Luck</h6>

          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'higherOrLower' ? 'btn-active' : 'btn-info']"
                  @click="changeView('higherOrLower')">
            <i class="bi bi-arrow-up"></i>
            <span class="ms-2" v-if="sidebarOpen">Higher Or Lower</span>
          </button>


          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'guessNumber' ? 'btn-active' : 'btn-info']"
                  @click="changeView('guessNumber')">
            <i class="bi bi-question-circle"></i>
            <span class="ms-2" v-if="sidebarOpen">Guess the Number</span>
          </button>
  
		  
		</div>


        <!-- Analytics Section -->
        <div>
          <h5 v-if="sidebarOpen" class="text-primary">Analytics</h5>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'leaderboard' ? 'btn-active' : 'btn-info']"
                  @click="changeView('leaderboard')">
            <i class="bi bi-bar-chart"></i>
            <span class="ms-2" v-if="sidebarOpen">Leaderboard</span>
          </button>
          <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'stats' ? 'btn-active' : 'btn-info']"
                  @click="changeView('stats')">
            <i class="bi bi-graph-up"></i>
            <span class="ms-2" v-if="sidebarOpen">Stats</span>
          </button>
		  <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'userComplaintWrite' ? 'btn-active' : 'btn-info']"
		                    @click="changeView('userComplaintWrite')">
		              <i class="bi bi-graph-up"></i>
		              <span class="ms-2" v-if="sidebarOpen">Post Complaint</span>
            </button>
			
			<br><br>
			<br><br>
			<br>


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
