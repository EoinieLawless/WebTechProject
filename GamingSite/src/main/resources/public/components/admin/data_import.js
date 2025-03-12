export default {
    template: `
    <div class="container mt-5">
        <div class="card shadow border-0">
            <div class="card-body p-4">
                <h2 class="fw-bold text-primary mb-2">Data Import System</h2>
                <p class="text-muted mb-4">Select which files you want to import</p>

                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="all" v-model="importAll">
                    <label class="form-check-label fw-semibold" for="all">Import All</label>
                </div>
                
                <div v-if="!importAll" class="mb-3">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="gameScores" v-model="selectedFiles" value="gameScores">
                        <label class="form-check-label" for="gameScores">Game Scores</label>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="complaints" v-model="selectedFiles" value="complaints">
                        <label class="form-check-label" for="complaints">User Complaints</label>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="users" v-model="selectedFiles" value="users">
                        <label class="form-check-label" for="users">User Registry</label>
                    </div>
                </div>

                <button class="btn btn-primary w-100 d-flex align-items-center justify-content-center" @click="importData" :disabled="isUploading">
                    <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
                    <span>{{ isUploading ? 'Importing...' : 'Start Import' }}</span>
                </button>

                <transition name="fade">
                    <div v-if="alertMessage" :class="['alert', alertClass, 'mt-3', 'text-center']">
                        {{ alertMessage }}
                    </div>
                </transition>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            importAll: false,
            selectedFiles: [],
            isUploading: false,
            alertMessage: "",
            alertClass: ""
        };
    },

    methods: {
        async importData() {
            this.isUploading = true;
            this.alertMessage = "";

            let requestBody = {};
            if (this.importAll) {
                requestBody.importAll = true;
            } else {
                requestBody.selectedFiles = this.selectedFiles;
            }

            try {
                const jwt = localStorage.getItem('jwt');
                if (!jwt) {
                    alert('You are not logged in');
                    return;
                }

                const response = await fetch("/api/admin/files/import", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${jwt}`
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    const data = await response.json();
                    this.alertMessage = data.status;
                    this.alertClass = "alert-success";
                } else {
                    const errorText = await response.text();
                    this.alertMessage = "Error: " + errorText;
                    this.alertClass = "alert-danger";
                }
            } catch (error) {
                this.alertMessage = "Error processing import: " + error.message;
                this.alertClass = "alert-danger";
            } finally {
                this.isUploading = false;
            }
        }
    }
};
