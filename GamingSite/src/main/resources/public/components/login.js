export default {
  template: `
<div class="container d-flex justify-content-center align-items-center" 
     style="height: 100vh; background: url('assets/images/gaming.png') no-repeat center center; background-size: 1000px auto;">
    <div class="card shadow-lg p-4" style="max-width: 450px; width: 100%; border-radius: 12px; background: rgba(255, 255, 255, 0.85);">
        
        
        <h2 class="text-center text-primary mb-4">{{ isRegistering ? "Register" : "Login" }}</h2>

        <!-- LOGIN FORM -->
        <form v-if="!isRegistering" @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="username" class="font-weight-semibold">Username</label>
                <input type="text" id="username" class="form-control" v-model="username" required placeholder="Enter your username">
            </div>

            <div class="form-group mt-3">
                <label for="password" class="font-weight-semibold">Password</label>
                <input type="password" id="password" class="form-control" v-model="password" required placeholder="Enter your password">
            </div>

            <button type="submit" class="btn btn-primary btn-block mt-4 py-2" :disabled="isLoading">
                {{ isLoading ? "Logging in..." : "Login" }}
            </button>

            <div v-if="errorMessage" class="alert alert-danger mt-3">
                <strong>Error:</strong> {{ errorMessage }}
            </div>

            <p class="text-center mt-3">
                Don't have an account? <a href="#" @click="toggleRegister">Register here</a>
            </p>
        </form>

        <!-- REGISTRATION FORM -->
		<form v-else @submit.prevent="handleRegister">
		    <div class="form-group">
		        <label for="newUsername" class="font-weight-semibold">Username</label>
		        <input type="text" id="newUsername" class="form-control" v-model="newUsername" required placeholder="Choose a username">
		    </div>

		    <div class="form-group mt-3">
		        <label for="email" class="font-weight-semibold">Email</label>
		        <input type="email" id="email" class="form-control" v-model="email" required placeholder="Enter your email">
		    </div>

		    <div class="form-group mt-3">
		        <label for="newPassword" class="font-weight-semibold">Password</label>
		        <input type="password" id="newPassword" class="form-control" v-model="newPassword" required placeholder="Create a password">
		    </div>

		    <div class="form-group mt-3">
		        <label for="confirmPassword" class="font-weight-semibold">Confirm Password</label>
		        <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword" required placeholder="Confirm your password">
		    </div>

		    <button type="submit" class="btn btn-success btn-block mt-4 py-2" :disabled="isLoading">
		        {{ isLoading ? "Registering..." : "Register" }}
		    </button>
			
			<p class="text-center mt-3">
			                Already have an account? <a href="#" @click="toggleRegister">Back to Login</a>
			            </p>

		    <div v-if="errorMessage" class="alert alert-danger mt-3">
		        <strong>Error:</strong> {{ errorMessage }}
		    </div>
		</form>


    </div>
</div>
  `,
  data() {
    return {
      isRegistering: false,
      isLoading: false,
      username: '',
      password: '',
      newUsername: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
        this.isLoading = true;
        this.errorMessage = '';
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.username, password: this.password })
            });
            if (!response.ok) throw new Error('Invalid username or password');
            const data = await response.json();
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.roles.includes('ADMIN') ? 'ADMIN' : 'USER');
            localStorage.setItem('currentRole', data.roles.includes('ADMIN') ? 'ADMIN' : 'USER');
            this.$root.changeView(data.roles.includes('ADMIN') ? 'data_import' : 'user_dashboard');
            window.location.reload();
        } catch (error) {
            this.errorMessage = 'Error: ' + error.message;
        } finally {
            this.isLoading = false;
        }
    },

	async handleRegister() {
	    this.isLoading = true;
	    this.errorMessage = '';

	    if (this.newPassword !== this.confirmPassword) {
	        this.errorMessage = "Passwords do not match.";
	        this.isLoading = false;
	        return;
	    }

	    try {
	        const response = await fetch('/api/auth/register', {
	            method: 'POST',
	            headers: { 'Content-Type': 'application/json' },
	            body: JSON.stringify({ 
	                username: this.newUsername, 
	                password: this.newPassword, 
	                email: this.email 
	            })
	        });

	        if (!response.ok) {
	            const errorData = await response.json();
	            throw new Error(errorData.message || 'Registration failed');
	        }

	        alert("Registration successful! You can now log in.");
	        this.toggleRegister();
	    } catch (error) {
	        this.errorMessage = 'Error: ' + error.message;
	    } finally {
	        this.isLoading = false;
	    }
	},

    toggleRegister() {
        this.isRegistering = !this.isRegistering;
        this.errorMessage = ''; // Clear any error messages
    }
  }
};
