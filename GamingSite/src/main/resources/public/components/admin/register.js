export default {
  template: `
    <div class="container py-4">
      <div class="row">
        <!-- Registration Form on Left -->
        <div class="col-md-5">
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-body p-4">
              <h4 class="fw-bold text-primary mb-3">User Registration</h4>

              <form @submit.prevent="registerUser">
                <div class="mb-3">
                  <input type="text" class="form-control" placeholder="Username" v-model="username" required>
                </div>

                <div class="mb-3">
                  <input type="password" class="form-control" placeholder="Password" v-model="password" required pattern="^(?=.*\\d).{6,}$" title="Password must be at least 6 characters long and contain at least one number">
                </div>

                <div class="mb-3">
                  <input type="email" class="form-control" placeholder="Email" v-model="email" required>
                </div>

                <!-- Role Selection -->
                <div class="mb-3">
                  <div class="dropdown w-100">
                    <button class="btn btn-outline-secondary w-100" type="button" @click="toggleDropdown">
                      <span class="text-truncate">{{ selectedRoles.length ? selectedRoles.join(', ') : 'Select Roles' }}</span>
                      <i class="bi bi-chevron-down ms-2"></i>
                    </button>
                    <div class="dropdown-menu w-100 shadow-sm" :class="{ 'show': isDropdownOpen }">
                      <div class="p-2">
                        <div class="form-check" v-for="role in availableRoles" :key="role">
                          <input class="form-check-input" type="checkbox" :id="role" :value="role" v-model="selectedRoles">
                          <label class="form-check-label" :for="role">{{ formatRole(role) }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                  <span class="spinner-border spinner-border-sm me-2" v-if="isLoading"></span>
                  {{ isLoading ? "Registering..." : "Register" }}
                </button>
              </form>

              <div v-if="alertMessage" :class="['alert', alertClass, 'mt-3', 'fade-in']" role="alert">
                {{ alertMessage }}
              </div>
            </div>
          </div>
        </div>

        <!-- User List on Right -->
        <div class="col-md-7">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <h3 class="mb-3">User List</h3>
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
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button type="button"  @click="closeModal" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this user?
            </div>
            <div class="modal-footer">
			<button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
              <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      username: "",
      password: "",
      email: "",
      selectedRoles: [],
      isDropdownOpen: false,
      isLoading: false,
      alertMessage: "",
      alertClass: "",
      availableRoles: ["ADMIN", "USER"],
      dataTable: null,
      userIdToDelete: null
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.initDataTable();
    });

	$(document).on('click', '.delete-user', (event) => {
	  const userId = $(event.currentTarget).data('id');
	  const userRoles = $(event.currentTarget).data('roles').split(',');

	  // Prevent deletion of Admin users
	  if (userRoles.includes("ADMIN")) {
	    this.showAlert("Admin users cannot be deleted!", "alert-danger");
	    return;
	  }

	  this.userIdToDelete = userId;
	  $('#confirmDeleteModal').modal('show');
	});
  },

  methods: {
    initDataTable() {
		this.dataTable = $('#usersTable').DataTable({
		  ajax: {
		    url: '/api/admin/users',
		    dataSrc: function(json) {
		      return json._embedded?.userList || [];
		    },
		    headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
		  },
		  columns: [
		    { data: 'id' },
		    { data: 'username' },
		    { data: 'roles', render: data => data ? data.join(', ') : '' },
		    { data: null, orderable: false, render: (data, type, row) =>
		        `<button class="btn btn-danger btn-sm delete-user" data-id="${row.id}" data-roles="${row.roles.join(',')}">Delete</button>`
		    }
		  ]

		});
    },

    toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; },
    closeDropdown() { this.isDropdownOpen = false; },

    async registerUser() {
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
            "Authorization": `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            email: this.email,
            roles: this.selectedRoles
          })
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
	
	closeModal() {
	  this.userIdToDelete = null;
	  $("#confirmDeleteModal").modal("hide");
	},


	async confirmDelete() {
	  if (!this.userIdToDelete) return;

	  try {
	    const response = await fetch(`/api/admin/users/${this.userIdToDelete}`, {
	      method: "DELETE",
	      headers: {
	        "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
	        "Content-Type": "application/json"
	      }
	    });

	    if (!response.ok && response.status !== 204) {
	      const responseData = await response.json().catch(() => ({})); 
	      throw new Error(responseData.error || "Failed to delete user");
	    }

	    // Hide the modal first
	    $("#confirmDeleteModal").modal("hide");

	    // Refresh the table data
	    this.dataTable.ajax.reload(null, false); // Reload without resetting pagination

	    // Show a success message
	    this.showAlert("User deleted successfully!", "alert-success");

	  } catch (error) {
	    this.showAlert("Error deleting user: " + error.message, "alert-danger");
	  }
	},

    showAlert(message, type) {
      this.alertMessage = message;
      this.alertClass = type;
    },

    formatRole(role) {
      return role.toLowerCase().replace("_", " ").replace(/\b\w/g, char => char.toUpperCase());
    }
  }
};
