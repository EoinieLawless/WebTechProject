export default {
  template: `
    <div class="container mt-5 p-4 rounded shadow bg-light text-center">
        <h2 class="mb-4 text-primary">IMSIs and Failures Viewer</h2>
        <p class="text-muted">Select a time period to view IMSIs with associated failures.</p>
        
        <!-- Date Range Input Form -->
        <form @submit.prevent="fetchIMSIs">
            <div class="form-group mb-3">
                <label for="startDate" class="font-weight-bold">Start Date</label>
                <input type="datetime-local" class="form-control" id="startDate" v-model="startDate" required>
            </div>
            <div class="form-group mb-3">
                <label for="endDate" class="font-weight-bold">End Date</label>
                <input type="datetime-local" class="form-control" id="endDate" v-model="endDate" required>
            </div>
            <button type="submit" class="btn btn-primary btn-lg mt-3" :disabled="isLoading">
                {{ isLoading ? "Fetching..." : "Search" }}
            </button>
        </form>

        <!-- Alert Messages -->
        <div v-if="alertMessage" :class="['alert', alertClass, 'mt-3']" role="alert">
            {{ alertMessage }}
        </div>

        <!-- IMSIs and Failures Table -->
        <div v-if="imsis.length > 0" class="mt-4">
            <h4 class="text-success">IMSIs and Failures</h4>
            <table class="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>IMSI</th>
                        <th>Failure Code</th>
                        <th>Failure Description</th>
                        <th>Failure Count</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(imsi, index) in imsis" :key="index">
                        <tr>
                            <td :rowspan="imsi.failureDetails.length">{{ index + 1 }}</td>
                            <td :rowspan="imsi.failureDetails.length">{{ imsi.imsi }}</td>
                            <td>{{ imsi.failureDetails[0].failureCode }}</td>
                            <td>{{ imsi.failureDetails[0].failureDescription }}</td>
                            <td>{{ imsi.failureDetails[0].failureCount }}</td>
                        </tr>
                        <tr v-for="(detail, idx) in imsi.failureDetails.slice(1)" :key="idx">
                            <td>{{ detail.failureCode }}</td>
                            <td>{{ detail.failureDescription }}</td>
                            <td>{{ detail.failureCount }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
  `,

  data() {
    return {
      startDate: "", // Start date for the time range
      endDate: "", // End date for the time range
      imsis: [], // List of IMSIs with failures
      isLoading: false, // Loading state for the button
      alertMessage: "", // Alert message to display
      alertClass: "", // Class for the alert (success, danger, etc.)
    };
  },

  methods: {
    async fetchIMSIs() {
      this.isLoading = true;
      this.alertMessage = "";
      this.alertClass = "";
      this.imsis = [];

      try {
        console.log("Raw Start Date:", this.startDate);
        console.log("Raw End Date:", this.endDate);

        // Format the date to match the backend's expectations
        const formattedStartDate = this.formatDate(this.startDate); // "dd-MM-yyyy HH:mm:ss"
        const formattedEndDate = this.formatDate(this.endDate);

        console.log("Formatted Start Date:", formattedStartDate);
        console.log("Formatted End Date:", formattedEndDate);

        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
          this.showAlert("You are not logged in!", "alert-danger");
          this.isLoading = false;
          return;
        }

        const response = await fetch(
          `/api/eventrecord/imsi-failure?startDate=${encodeURIComponent(
            formattedStartDate
          )}&endDate=${encodeURIComponent(formattedEndDate)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        console.log("API Response Status:", response.status);

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Error fetching IMSIs:", errorMessage);
          this.showAlert(`Error: ${errorMessage}`, "alert-danger");
          return;
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        if (Array.isArray(data) && data.length > 0) {
          this.imsis = data;
          this.showAlert("Data fetched successfully!", "alert-success");
        } else if (data.message) {
          this.showAlert(data.message, "alert-warning");
        } else {
          this.showAlert("No data found.", "alert-warning");
        }
      } catch (error) {
        console.error("Error fetching IMSIs:", error);
        this.showAlert("Error fetching IMSIs. Please try again later.", "alert-danger");
      } finally {
        this.isLoading = false;
      }
    },

    showAlert(message, type) {
      this.alertMessage = message;
      this.alertClass = type;
    },

    // Format the date as "dd-MM-yyyy HH:mm:ss"
    formatDate(dateTime) {
      const date = new Date(dateTime);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = "00"; // Ensure seconds are always "00"
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    },
  },
};
