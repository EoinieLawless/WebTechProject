export default {
  template: `
    <div class="container mt-5">
      <h2 class="fw-bold text-primary mb-3 text-center">User Complaints</h2>
      
      <div v-if="complaints.length === 0" class="text-center">
        <p>No complaints available.</p>
      </div>

      <div v-for="complaint in complaints" :key="complaint.id" class="card shadow-sm p-3 mb-3">
        <h5>{{ complaint.username }} ({{ complaint.email }})</h5>
        <p>{{ complaint.message }}</p>
        <button @click="deleteComplaint(complaint.id)" class="btn btn-danger">Delete</button>
      </div>
    </div>
  `,
  data() {
    return {
      complaints: []
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
      }
    },

    async deleteComplaint(id) {
      try {
        const response = await fetch(`http://localhost:9091/api/complaints/delete/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete complaint");

        this.complaints = this.complaints.filter(complaint => complaint.id !== id);
      } catch (error) {
        console.error("Error deleting complaint:", error);
      }
    }
  }
};
