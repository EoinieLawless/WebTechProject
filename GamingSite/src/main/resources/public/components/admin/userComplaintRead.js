export default {
  template: `
    <div class="container mt-5">
      <h2 class="fw-bold text-primary mb-3 text-center">User Complaints</h2>
      
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- No Complaints Message -->
      <div v-if="!isLoading && complaints.length === 0" class="text-center mt-4">
        <p class="text-muted">No complaints available.</p>
      </div>

      <!-- Complaints List -->
      <div v-for="complaint in complaints" :key="complaint.id" class="complaint-card card shadow-sm p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-secondary">
            {{ complaint.username }} <small class="text-muted">({{ complaint.email }})</small>
          </h5>
          <button @click="showDeleteConfirmation(complaint.id)" class="btn btn-outline-danger btn-sm">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
        <p class="mt-2">{{ complaint.message }}</p>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showModal" class="delete-modal">
        <div class="modal-content">
          <h5>Confirm Deletion</h5>
          <p>Are you sure you want to delete this complaint?</p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-secondary" @click="showModal = false">Cancel</button>
            <button class="btn btn-danger" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>

      <style>
        .complaint-card {
          transition: all 0.3s ease-in-out;
          border-radius: 8px;
          background: white;
        }
        .complaint-card:hover {
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
          transform: scale(1.02);
        }
        .delete-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          text-align: center;
        }
        .modal-content {
          max-width: 300px;
          margin: auto;
        }
      </style>
    </div>
  `,
  data() {
    return {
      complaints: [],
      isLoading: true,
      showModal: false,
      complaintToDelete: null
    };
  },
  mounted() {
    this.fetchComplaints();
  },
  methods: {
    async fetchComplaints() {
      try {
        const response = await fetch("http://localhost:9091/api/complaints/all");
        if (!response.ok) throw new Error("Failed to fetch complaints");

        this.complaints = await response.json();
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        this.isLoading = false;
      }
    },

    showDeleteConfirmation(id) {
      this.complaintToDelete = id;
      this.showModal = true;
    },

    async confirmDelete() {
      if (!this.complaintToDelete) return;

      try {
        const response = await fetch(`http://localhost:9091/api/complaints/delete/${this.complaintToDelete}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete complaint");

        this.complaints = this.complaints.filter(complaint => complaint.id !== this.complaintToDelete);
        this.showModal = false;
      } catch (error) {
        console.error("Error deleting complaint:", error);
      }
    }
  }
};
