export default {
  template: `
<div v-if="authState.isLoggedIn" class="d-flex flex-column border-end bg-light" style="min-height: 100vh;">
  <!-- Toggle Button Always Visible at the Top -->
  <div class="d-flex justify-content-start p-2">
    <button class="btn btn-outline-black" @click="toggleSidebar">
      <i class="bi bi-square-half"></i>
    </button>
  </div>
  
  <!-- Sidebar -->
  <aside :class="['d-flex flex-column p-3', sidebarOpen ? 'w-100' : 'w-auto']" 
         style="min-height: 100vh; width: 100px; transition: width 0.3s;">
		 
 <!-- Games Section -->
     <div>
       <h5 v-if="sidebarOpen" class="text-primary">Games</h5>
       <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'flappyBird' ? 'btn-active' : 'btn-success']"
               @click="changeView('flappyBird')">
         <i class="bi bi-controller"></i>
         <span class="ms-2" v-if="sidebarOpen">Flappy Bird</span>
       </button>
     </div>
    
    <!-- Admin-only Buttons -->
    <div v-if="authState.currentRole === 'ADMIN'">
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
    </div>

    <!-- Customer Service Rep-only Buttons -->
    <div v-if="authState.currentRole === 'CUSTOMER_SERVICE_REP'">
      <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'tempCustServ' ? 'btn-active' : 'btn-info']"
              @click="changeView('tempCustServ')">
        <i class="bi bi-person-lines-fill"></i>
        <span class="ms-2" v-if="sidebarOpen">Customer Service</span>
      </button>
    </div>

    <!-- Support Engineer-only Buttons -->
    <div v-if="authState.currentRole === 'SUPPORT_ENGINEER'">
      <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'tempSupportEng' ? 'btn-active' : 'btn-warning']"
              @click="changeView('tempSupportEng')">
        <i class="bi bi-tools"></i>
        <span class="ms-2" v-if="sidebarOpen">Support Engineer</span>
      </button>
    </div>

    <!-- Network Management Engineer-only Buttons -->
    <div v-if="authState.currentRole === 'NETWORK_MANAGEMENT_ENGINEER'">
      <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'tempNetworkManEng' ? 'btn-active' : 'btn-success']"
              @click="changeView('tempNetworkManEng')">
        <i class="bi bi-server"></i>
        <span class="ms-2" v-if="sidebarOpen">Network Management</span>
      </button>
    </div>

  </aside>
</div>
  `,
  inject: ['authState'],
  data() {
    return {
      sidebarOpen: true,
      selectedView: '' // Track the active tab
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    changeView(view) {
      this.selectedView = view; // Update active tab
      this.$emit('change-view', view); // Emit event to parent component
    }
  }
};
