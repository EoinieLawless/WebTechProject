export default {
    template: `
    <div class="container mt-5 text-center">
        <h2 class="fw-bold text-primary mb-3">Profile Statistics</h2>
        <h3 class="fw-bold text-secondary">{{ username }}</h3>
        
        <div class="row mt-4">
            <div class="col-md-4">
                <div class="card shadow-sm border-0 p-3">
                    <h5>Most Played Game</h5>
                    <p class="fw-bold">{{ mostPlayedGame }}</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow-sm border-0 p-3">
                    <h5>Best Score</h5>
                    <p class="fw-bold">{{ bestScore }}</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow-sm border-0 p-3">
                    <h5>Leaderboard Rank</h5>
                    <p class="fw-bold">#{{ leaderboardRank }}</p>
                </div>
            </div>
        </div>
        
        <div class="row mt-5">
            <div class="col-md-6">
                <h5>Personal Radar Chart</h5>
                <canvas ref="personalRadarChart"></canvas>
            </div>
            <div class="col-md-6">
                <h5>Global Player Average Radar Chart</h5>
                <canvas ref="globalRadarChart"></canvas>
            </div>
        </div>
    </div>
    `,
    
    data() {
        return {
            username: localStorage.getItem("username") || "Guest",
            mostPlayedGame: "Loading...",
            bestScore: "Loading...",
            leaderboardRank: "Loading...",
            personalStats: [],
            globalStats: [],
        };
    },

    mounted() {
        this.fetchStats();
    },

    methods: {
        async fetchStats() {
            try {
                const response = await fetch(`http://localhost:9091/api/personalStats/${this.username}`);
                if (!response.ok) throw new Error("Failed to fetch stats");
                const data = await response.json();
                this.mostPlayedGame = data.mostPlayedGame || "N/A";
                this.bestScore = data.bestScore || 0;
                this.leaderboardRank = data.leaderboardRank || "N/A";
                this.personalStats = data.personalStats || [0, 0, 0];
                this.globalStats = data.globalStats || [0, 0, 0];
                this.renderCharts();
            } catch (error) {
                console.error(error);
            }
        },

        renderCharts() {
            const personalCtx = this.$refs.personalRadarChart.getContext("2d");
            const globalCtx = this.$refs.globalRadarChart.getContext("2d");

            new Chart(personalCtx, {
                type: 'radar',
                data: {
                    labels: ["Precision", "Puzzle Solving", "Luck"],
                    datasets: [{
                        label: "Personal Stats",
                        data: this.personalStats,
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1
                    }]
                }
            });

            new Chart(globalCtx, {
                type: 'radar',
                data: {
                    labels: ["Precision", "Puzzle Solving", "Luck"],
                    datasets: [{
                        label: "Global Average",
                        data: this.globalStats,
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1
                    }]
                }
            });
        }
    }
};
