export default {
  data() {
    return {
      imsi: '',
      results: null,
      message: '',
      isLoading: false,
      imsiOptions: [
        '344930000000001', 
        '310560000000002', 
        '240210000000003'
      ]
    };
  },
  methods: {
    async searchFailures() {
      try {
        this.isLoading = true;
        const response = await fetch(`/api/customer-service/failures/${this.imsi}`);
        const data = await response.json();

        if (data.message) {
          this.message = data.message;
          this.results = null;
        } else {
          this.results = data;
          this.message = '';
        }
      } catch (error) {
        this.message = 'Error fetching data.';
      } finally {
        this.isLoading = false;
      }
    }
  },
  template: `
    <div class="container py-4" style="max-height: 80vh; overflow-y: auto;">
      <!-- Failure Search Form -->
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-body p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h4 class="fw-bold text-primary mb-0">Failure Search</h4>
            <span class="text-muted small">Search failures by IMSI</span>
          </div>
          <form @submit.prevent="searchFailures">
            <div class="row g-3">
              <div class="col-md-8">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter IMSI" 
                  v-model="imsi" 
                  list="imsi-list"
                  required
                >
                <datalist id="imsi-list">
                  <option v-for="option in imsiOptions" :key="option" :value="option"></option>
                </datalist>
              </div>
              <div class="col-md-4">
                <button 
                  type="submit" 
                  class="btn btn-primary w-100" 
                  :disabled="isLoading"
                >
                  <span class="spinner-border spinner-border-sm me-2" v-if="isLoading"></span>
                  {{ isLoading ? "Searching..." : "Search" }}
                </button>
              </div>
            </div>
          </form>
          <p v-if="message" class="text-danger mt-3">{{ message }}</p>
        </div>
      </div>
      
      <!-- Results Table -->
      <div class="card shadow-sm border-0 mb-4" v-if="results">
        <div class="card-body p-4">
          <h4 class="fw-bold text-secondary">Search Results</h4>
          <div style="max-height: 300px; overflow-y: auto;">
            <table class="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Cause Code</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in results" :key="result.eventId">
                  <td>{{ result.eventId }}</td>
                  <td>{{ result.causeCode }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
};
