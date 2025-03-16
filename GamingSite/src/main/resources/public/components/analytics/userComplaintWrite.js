export default {
	template: `
    <div class="container mt-5">
      <h2 class="fw-bold text-primary mb-3 text-center">Submit a Complaint</h2>
      
      <div class="form-group">
        <label for="username">Name</label>
        <input type="text" id="username" class="form-control" v-model="username" disabled>
      </div>
      
      <div class="form-group mt-3">
        <label for="email">Email</label>
        <input type="email" id="email" class="form-control" v-model="email" disabled>
      </div>

      <div class="form-group mt-3">
        <label for="message">Complaint</label>
        <textarea id="message" class="form-control" v-model="message" rows="4" required></textarea>
      </div>

      <button @click="submitComplaint" class="btn btn-primary mt-4">Submit</button>

      <div v-if="successMessage" class="alert alert-success mt-3">
        {{ successMessage }}
      </div>
    </div>
  `,
	data() {
		return {
			username: "",
			email: "",
			message: "",
			successMessage: ""
		};
	},
	mounted() {
		this.getCurrentUser();
	},
	methods: {
		async getCurrentUser() {
			try {
				const response = await fetch("http://localhost:9091/api/auth/currentUser", {
					headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}` }
				});

				if (!response.ok) throw new Error("Failed to fetch user");

				const userData = await response.json();
				this.username = userData.username;
				this.email = userData.email;
			} catch (error) {
				console.error("Error fetching current user:", error);
			}
		},

		async submitComplaint() {
			try {
				const response = await fetch("http://localhost:9091/api/complaints/submit", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("jwt")}`
					},
					body: JSON.stringify({
						username: this.username,
						email: this.email,
						message: this.message
					})
				});

				if (!response.ok) throw new Error("Failed to submit complaint");

				this.successMessage = "Complaint submitted successfully!";
				this.message = ""; // Clear message field

			} catch (error) {
				console.error("Error submitting complaint:", error);
			}
		}
	}
};
