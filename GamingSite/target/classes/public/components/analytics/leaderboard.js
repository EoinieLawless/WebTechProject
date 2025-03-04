export default {
    template: `
     <div class="container mt-5">
  <div class="card shadow-sm border-0">
    <div class="card-body p-4">
      <!-- Header -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="fw-bold text-primary mb-1">File Upload System</h2>
          <p class="text-muted  mb-0">Upload your sample file for processing</p>
        </div>
        <button 
          class="btn btn-primary d-flex align-items-center gap-2" 
          @click="uploadData" 
          :disabled="isUploading"
        >
          <i class="bi bi-cloud-upload"></i>
          <span>{{ isUploading ? "Uploading..." : "Upload File" }}</span>
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="isUploading">
        <div class="d-flex justify-content-between  text-muted mb-1">
          <span>Uploading file...</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="progress" style="height: 6px;">
          <div class="progress-bar bg-primary" 
               role="progressbar" 
               :style="{ width: progress + '%' }">
          </div>
        </div>
      </div>

      <!-- Status Alert -->
      <div v-if="alertMessage" :class="['alert', alertClass, 'mt-3 mb-0 d-flex align-items-center']" role="alert">
        <i :class="['bi', alertClass === 'alert-success' ? 'bi-check-circle' : 'bi-exclamation-circle', 'me-2']"></i>
        {{ alertMessage }}
      </div>

      <!-- Error Records Summary -->
      <div v-if="errorRecordsMessage" class="mt-3 p-3 border rounded-3 bg-light">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-3">
            <div class="p-2 rounded-circle bg-warning bg-opacity-10">
              <i class="bi bi-exclamation-triangle text-warning"></i>
            </div>
            <div>
              <h6 class="mb-1 fw-semibold">Processing Summary</h6>
              <p class="mb-0 text-muted">
                <span class="fw-semibold text-warning">{{ errorCount }}</span> erroneous records found
              </p>
            </div>
          </div>
          <button 
            @click="downloadErrorLog"
            class="btn btn-outline-primary d-flex align-items-center gap-2"
          >
            <i class="bi bi-download"></i>
            <span>Download Log</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

    `,

    data() {
        return {
            fileName: "SampleData.xls", // Name of the file to upload
            isUploading: false, // Flag to indicate if the upload is in progress
            progress: 0, // Progress percentage
            intervalId: null, // ID for the progress simulation interval
            alertMessage: "", // Message to display as an alert
            alertClass: "", // Class to style the alert (e.g., success, danger)
            errorRecordsMessage: "", // Message showing error details
            errorCount: 0, // Number of erroneous records
        };
    },

    methods: {
        async uploadData() {
            this.isUploading = true;
            this.progress = 0;
            this.alertMessage = "";
            this.errorRecordsMessage = "";
            this.startProgressSimulation();

            let formData = new FormData();
            formData.append("fileName", this.fileName);

            try {
                const jwt = localStorage.getItem('jwt');

                    if (!jwt) {
                        alert('You are not logged in');
                        return;
                    }
                
                const response = await fetch("/api/admin/files/import", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json",
                        'Authorization': `Bearer ${jwt}`  // Add JWT to Authorization header
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.progress = 100;
                    clearInterval(this.intervalId);

                    setTimeout(() => {
                        this.showAlert(data.status, "alert-success");
                        this.errorCount = data.errorCount; // Set the error count
                        if (this.errorCount > 0) {
                            this.errorRecordsMessage = `Click the link to download the error log. ${this.errorCount} erroneous records found.`;
                        } else {
                            this.errorRecordsMessage = "No errors found. All records processed successfully.";
                        }
                        this.isUploading = false;
                    }, 500);
                } else {
                    const errorMessage = await response.text();
                    this.showAlert("Error: " + errorMessage, "alert-danger");
                    this.resetProgress();
                }
            } catch (error) {
                this.showAlert("Error processing file: " + error.message, "alert-danger");
                this.resetProgress();
            }
        },

        async downloadErrorLog() {
            try {
                const jwt = localStorage.getItem('jwt');

                    if (!jwt) {
                        alert('You are not logged in');
                        return;
                    }
                const response = await fetch("/api/admin/files/download-error-log", {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${jwt}`  // Add JWT to Authorization header
                    }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "error-log-file.xlsx"; // Name of the downloaded file
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    window.URL.revokeObjectURL(url);
                } else {
                    this.showAlert("No error log available to download.", "alert-warning");
                }
            } catch (error) {
                console.error("Error downloading error log:", error);
                this.showAlert("Error downloading error log file.", "alert-danger");
            }
        },

        startProgressSimulation() {
            this.intervalId = setInterval(() => {
                if (this.progress < 90) {
                    this.progress += 10;
                }
            }, 300);
        },

        resetProgress() {
            this.isUploading = false;
            this.progress = 0;
            clearInterval(this.intervalId);
        },

        showAlert(message, type) {
            this.alertMessage = message;
            this.alertClass = type;
        },
    },


    style: `
        <style scoped>
            .container {
                max-width: 500px;
                border: 1px solid #ddd;
            }
            .progress {
                height: 25px;
            }
            .progress-bar {
                font-weight: bold;
            }
            .btn-lg {
                padding: 12px 24px;
                font-size: 18px;
            }
        </style>
    `
};