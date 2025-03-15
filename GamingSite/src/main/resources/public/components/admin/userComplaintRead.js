export default {
  template: `
    <div class="container mt-5">
      <h2 class="fw-bold text-primary mb-4 text-center">📩 User Complaints</h2>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="loading-container text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-2">Fetching complaints...</p>
      </div>

      <!-- No Complaints Message -->
      <div v-if="!isLoading && complaints.length === 0" class="text-center mt-4">
        <p class="text-muted">✅ No complaints available.</p>
      </div>

      <!-- Complaints List -->
      <div class="complaints-list">
        <div v-for="complaint in visibleComplaints" :key="complaint.id" class="complaint-card card shadow-sm p-3 mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="fw-bold text-secondary">
              {{ complaint.username }} <small class="text-muted">({{ complaint.email }})</small>
            </h5>
            <button @click="showDeleteConfirmation(complaint.id)" class="btn btn-outline-danger btn-sm">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
          <p class="mt-2 complaint-message">{{ complaint.message }}</p>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="!isLoading && complaints.length > visibleComplaints.length" class="text-center mt-3">
        <button class="btn btn-primary" @click="loadMoreComplaints">Load More</button>
      </div>

      <!-- Delete Confirmation Modal -->
      <transition name="fade">
        <div v-if="showModal" class="delete-modal">
          <div class="modal-content">
            <h5 class="text-danger fw-bold">⚠ Confirm Deletion</h5>
            <p>Are you sure you want to delete this complaint?</p>
            <div class="d-flex justify-content-between">
              <button class="btn btn-secondary" @click="showModal = false">Cancel</button>
              <button class="btn btn-danger" @click="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      </transition>

      <style>
        /* General Styling */
        .complaints-list {
          max-width: 700px;
          margin: auto;
        }

        .complaint-card {
          transition: all 0.3s ease-in-out;
          border-radius: 8px;
          background: white;
          overflow: hidden;
        }

        .complaint-card:hover {
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
          transform: scale(1.02);
        }

        .complaint-message {
          font-size: 16px;
          color: #333;
        }

        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 50px;
        }

        /* Load More Button */
        .btn-primary {
          font-size: 16px;
          padding: 8px 16px;
          border-radius: 6px;
        }

        /* Delete Confirmation Modal */
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
          min-width: 300px;
        }

        .modal-content {
          max-width: 350px;
          margin: auto;
        }

        /* Fade Animation for Modal */
        .fade-enter-active, .fade-leave-active {
          transition: opacity 0.3s;
        }
        .fade-enter, .fade-leave-to {
          opacity: 0;
        }
      </style>
    </div>
  `,
  data() {
    return {
      complaints: [],
      visibleComplaints: [],
      isLoading: true,
      showModal: false,
      complaintToDelete: null,
      complaintsPerPage: 5, // Show 5 complaints at a time
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
        this.visibleComplaints = this.complaints.slice(0, this.complaintsPerPage); // Load first 5 complaints
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        this.isLoading = false;
      }
    },

    loadMoreComplaints() {
      const currentLength = this.visibleComplaints.length;
      const nextBatch = this.complaints.slice(currentLength, currentLength + this.complaintsPerPage);
      this.visibleComplaints = [...this.visibleComplaints, ...nextBatch];
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
        this.visibleComplaints = this.visibleComplaints.filter(complaint => complaint.id !== this.complaintToDelete);
        this.showModal = false;
      } catch (error) {
        console.error("Error deleting complaint:", error);
      }
    }
  }
};
