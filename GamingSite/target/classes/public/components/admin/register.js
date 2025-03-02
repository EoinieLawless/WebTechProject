export default {
  template: `
    <div class="container py-4">
      <!-- Registration Form -->
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h4 class="fw-bold text-primary mb-0">User Registration</h4>
            <span class="text-muted small">Create an account with roles</span>
          </div>

          <form @submit.prevent="registerUser">
            <div class="row g-3">
              <!-- Username Field -->
              <div class="col-md-4">
                <div class="form-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Username"
                    v-model="username" 
                    required
                  >
                </div>
              </div>

              <!-- Password Field with Front-End Validation -->
              <div class="col-md-4">
                <div class="form-group">
                  <input 
                    type="password" 
                    class="form-control" 
                    placeholder="Password"
                    v-model="password" 
                    required
                    pattern="^(?=.*\\d).{6,}$"
                    title="Password must be at least 6 characters long and contain at least one number"
                  >
                </div>
              </div>

              <!-- Roles Selection -->
              <div class="col-md-4">
                <div class="dropdown w-100" v-click-outside="closeDropdown">
                  <button 
                    class="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center" 
                    type="button" 
                    @click="toggleDropdown"
                  >
                    <span class="text-truncate">{{ selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Roles' }}</span>
                    <i class="bi bi-chevron-down ms-2"></i>
                  </button>
                  <div class="dropdown-menu w-100 shadow-sm" :class="{ 'show': isDropdownOpen }" style="position: absolute;">
                    <div class="p-2">
                      <div class="form-check" v-for="role in availableRoles" :key="role">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :id="role"
                          :value="role" 
                          v-model="selectedRoles"
                        >
                        <label class="form-check-label" :for="role">
                          {{ role.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alert Message and Submit Button -->
            <div class="d-flex align-items-center justify-content-between mt-3">
              <button 
                type="submit" 
                class="btn btn-primary px-4" 
                :disabled="isLoading"
              >
                <span class="spinner-border spinner-border-sm me-2" v-if="isLoading"></span>
                {{ isLoading ? "Registering..." : "Register" }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div v-if="alertMessage" :class="['alert', alertClass, 'mt-3']" role="alert">
        {{ alertMessage }}
      </div>

      <!-- User List -->
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body p-4">
          <div class="container">
            <h3>User List</h3>
            <table id="usersTable" class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Roles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this user?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .dropdown-menu {
        transform: translateY(10px);
        opacity: 0;
        transition: all 0.2s ease-in-out;
        margin-top: 5px;
        display: block !important; /* This ensures the transition works */
        visibility: hidden;
      }

      .dropdown-menu.show {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .alert {
        border-radius: 4px;
      }

      .form-control {
        height: 38px;
      }

      .btn {
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  `,

  data() {
    return {
      username: "",
      password: "",
      selectedRoles: [],
      isDropdownOpen: false,
      isLoading: false,
      alertMessage: "",
      alertClass: "",
      availableRoles: ["ADMIN", "CUSTOMER_SERVICE_REP", "SUPPORT_ENGINEER", "NETWORK_MANAGEMENT_ENGINEER"],
      dataTable: null,
      userIdToDelete: null
    };
  },

  mounted() {
    this.initDataTable();
    $('#usersTable tbody').on('click', '.delete-user', (event) => {
      this.userIdToDelete = $(event.currentTarget).data('id');
      $('#confirmDeleteModal').modal('show');
    });
  },

  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },

    async registerUser() {
      // Front-end password validation check
      if (!/^(?=.*\d).{6,}$/.test(this.password)) {
        this.showAlert("Password must be at least 6 characters long and contain at least one number", "alert-warning");
        return;
      }

      if (this.selectedRoles.length === 0) {
        this.showAlert("Please select at least one role!", "alert-warning");
        return;
      }

      this.isLoading = true;
      this.alertMessage = "";

      try {
        const response = await fetch("/api/admin/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({ username: this.username, password: this.password, roles: this.selectedRoles })
        });

        if (response.ok) {
          this.showAlert("Registration successful!", "alert-success");
          this.dataTable.ajax.reload();
        } else {
          this.showAlert("Username already taken", "alert-danger");
        }
      } catch (error) {
        this.showAlert("Error: " + error.message, "alert-danger");
      } finally {
        this.isLoading = false;
      }
    },

    async confirmDelete() {
      try {
        const response = await fetch(`/api/admin/users/${this.userIdToDelete}`, {
          method: "DELETE",
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        });

        if (response.ok) {
          this.showAlert("User deleted successfully.", "alert-success");
          this.dataTable.ajax.reload();
        } else {
          this.showAlert("Failed to delete user.", "alert-danger");
        }
      } catch (error) {
        this.showAlert("Error: " + error.message, "alert-danger");
      } finally {
        $('#confirmDeleteModal').modal('hide');
      }
    },

    showAlert(message, type) {
      this.alertMessage = message;
      this.alertClass = type;
    },

    initDataTable() {
      this.dataTable = $('#usersTable').DataTable({
        ajax: {
          url: '/api/admin/users',
          dataSrc: '',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        },
        columns: [
          { data: 'id' },
          { data: 'username' },
          { data: 'roles', render: data => data ? data.join(', ') : '' },
          { data: null, orderable: false, render: (data, type, row) => 
              `<button class="btn btn-danger btn-sm delete-user" data-id="${row.id}">Delete</button>` 
          }
        ]
      });
    }
  },

  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          // Check if the click was outside the dropdown
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(); // Call the method passed to v-click-outside
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  }
};
