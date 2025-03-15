export default {
    template: `
    <div class="container mt-5">
        <div class="card shadow border-0">
            <div class="card-body p-4">
                <h2 class="fw-bold text-primary mb-2">Data Import System</h2>
                <p class="text-muted mb-4">Click below to import all data</p>

                <div v-if="alertMessage" :class="['alert', alertClass, 'mt-3', 'text-center']">
                    {{ alertMessage }}
                </div>

                <button class="btn btn-primary w-100" @click="importData" :disabled="isUploading">
                    <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
                    <span>{{ isUploading ? 'Importing...' : 'Start Import' }}</span>
                </button>

                <h3 class="mt-4">Imported Data</h3>
                <div v-if="paginatedData.length">
                    <table class="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Game</th>
                                <th>Score</th>
                                <th>Game Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="data in paginatedData" :key="data.id">
                                <td>{{ data.username }}</td>
                                <td>{{ data.game }}</td>
                                <td>{{ data.score }}</td>
                                <td>{{ data.gameType }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <button class="btn btn-secondary w-100 mt-3" @click="loadMore" v-if="hasMore">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            isUploading: false,
            alertMessage: "",
            alertClass: "",
            importedData: [],
            displayedCount: 10
        };
    },

    computed: {
        paginatedData() {
            return this.importedData.slice(0, this.displayedCount);
        },
        hasMore() {
            return this.displayedCount < this.importedData.length;
        }
    },

    methods: {
        async importData() {
            this.isUploading = true;

            try {
                const response = await fetch("/api/admin/files/import", { method: "POST" });
                const data = await response.json();
                this.importedData = data.importedData || [];
                this.alertMessage = data.status || "Import successful!";
                this.alertClass = "alert-success";
            } catch (error) {
                this.alertMessage = "Error processing import: " + error.message;
                this.alertClass = "alert-danger";
            } finally {
                this.isUploading = false;
            }
        },
        loadMore() {
            this.displayedCount += 10;
        }
    }
};
