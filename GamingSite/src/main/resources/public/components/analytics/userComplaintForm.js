export default {
  template: `
    <div class="container mt-5">
      <h2 class="fw-bold text-primary mb-4 text-center">User Complaint Forum</h2>

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
          </div>
          <p class="mt-2 complaint-message">{{ complaint.message }}</p>

          <div class="d-flex justify-content-between align-items-center">
            <!-- Agreed Users List -->
            <p class="text-muted">
              <strong>Agreed by:</strong>
              <span v-if="complaint.agreedUsers.length === 0">No users yet</span>
              <span v-else>{{ complaint.agreedUsers.join(", ") }}</span>
            </p>

            <!-- Agree Button -->
            <button 
              @click="agreeToComplaint(complaint.id)" 
              class="btn btn-outline-success btn-sm"
              :disabled="complaint.userAgreed">
              {{ complaint.userAgreed ? "Agreed" : "Agree" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="!isLoading && complaints.length > visibleComplaints.length" class="text-center mt-3">
        <button class="btn btn-primary" @click="loadMoreComplaints">Load More</button>
      </div>

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
      </style>
    </div>
  `,
  data() {
    return {
      complaints: [],
      visibleComplaints: [],
      isLoading: true,
      complaintsPerPage: 5,
      currentUser: "" // currentUser will be fetched dynamically
    };
  },
  mounted() {
    // First, retrieve the current user then fetch complaints
    this.getCurrentUser().then(() => {
      this.fetchComplaints();
    });
  },
  methods: {
    async getCurrentUser() {
      try {
        const response = await fetch("http://localhost:9091/api/auth/currentUser", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}` }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }
        const userData = await response.json();
        this.currentUser = userData.username;
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    },

    async fetchComplaints() {
      try {
        const response = await fetch("http://localhost:9091/api/complaints/all");
        if (!response.ok) throw new Error("Failed to fetch complaints");

        let data = await response.json();
        this.complaints = data._embedded?.userComplaintDTOList.map(complaint => ({
          id: complaint.id,
          username: complaint.username,
          email: complaint.email,
          message: complaint.message,
          agreedUsers: [],
          userAgreed: false,
        })) || [];

        await this.fetchAgreedUsers();
        this.visibleComplaints = this.complaints.slice(0, this.complaintsPerPage);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        this.complaints = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAgreedUsers() {
      for (let complaint of this.complaints) {
        try {
          const response = await fetch(`http://localhost:9091/api/complaints/${complaint.id}/agreed-users`);
          if (!response.ok) {
            console.error(`Server error for complaint ${complaint.id}:`, response.status);
            continue;
          }
          let data = await response.json();
          complaint.agreedUsers = data.agreedUsers || [];
          complaint.userAgreed = complaint.agreedUsers.includes(this.currentUser);
        } catch (error) {
          console.error(`Error fetching agreed users for complaint ${complaint.id}:`, error);
        }
      }
    },

    async agreeToComplaint(complaintId) {
      try {
        const response = await fetch(`http://localhost:9091/api/complaints/${complaintId}/agree?username=${this.currentUser}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
          const responseData = await response.json();
          throw new Error(responseData.error || "Failed to agree to complaint");
        }
        // Update local state to reflect the new agreement
        let complaint = this.complaints.find(c => c.id === complaintId);
        if (complaint) {
          complaint.agreedUsers.push(this.currentUser);
          complaint.userAgreed = true;
        }
      } catch (error) {
        console.error("Error agreeing to complaint:", error);
        alert(error.message);
      }
    },

    loadMoreComplaints() {
      if (!Array.isArray(this.complaints)) return;
      const currentLength = this.visibleComplaints.length;
      const nextBatch = this.complaints.slice(currentLength, currentLength + this.complaintsPerPage);
      this.visibleComplaints = [...this.visibleComplaints, ...nextBatch];
    }
  }
};
