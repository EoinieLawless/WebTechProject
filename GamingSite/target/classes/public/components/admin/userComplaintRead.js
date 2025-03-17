export default {
  template: `
    <div class="container mt-5">
      <h2 class="fw-bold text-primary mb-4 text-center">User Complaints</h2>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="loading-container text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-2">Fetching complaints...</p>
      </div>

      <!-- No Complaints Message -->
      <div v-if="!isLoading && complaints.length === 0" class="text-center mt-4">
        <p class="text-muted">No complaints available.</p>
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
            <h5 class="text-danger fw-bold">Confirm Deletion</h5>
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
      complaintsPerPage: 5,
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

        let data = await response.json();

        this.complaints = data._embedded?.userComplaintDTOList || [];
        this.visibleComplaints = this.complaints.slice(0, this.complaintsPerPage);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        this.complaints = [];
      } finally {
        this.isLoading = false;
      }
    },

    loadMoreComplaints() {
      if (!Array.isArray(this.complaints)) return;
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

      // Find the complaint object using its ID
      const complaint = this.complaints.find(c => c.id === this.complaintToDelete);
      if (!complaint || !complaint._links || !complaint._links["delete-complaint"]) {
        console.error("Delete link not found for complaint id:", this.complaintToDelete);
        return;
      }

      // Use the HATEOAS delete link from the complaint
      const deleteUrl = complaint._links["delete-complaint"].href;
      
      try {
        const response = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          const responseData = await response.json();
          throw new Error(responseData.error || "Failed to delete complaint");
        }

        // Remove the deleted complaint from the UI
        this.complaints = this.complaints.filter(c => c.id !== this.complaintToDelete);
        this.visibleComplaints = this.visibleComplaints.filter(c => c.id !== this.complaintToDelete);
        this.showModal = false;
      } catch (error) {
        console.error("Error deleting complaint:", error);
        alert(error.message);
      }
    }
  }
};
