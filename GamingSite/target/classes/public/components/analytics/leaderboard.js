export default {
  template: `
  <br><br>
    <div class="leaderboard-container">
      <h2 class="leaderboard-title">Leaderboard</h2>

      <div class="toggle-buttons">
        <button class="leaderboard-btn" @click="showTopPlayers = true" :class="{ active: showTopPlayers }">Top Players</button>
        <button class="leaderboard-btn" @click="showTopPlayers = false" :class="{ active: !showTopPlayers }">Most Active Players</button>
      </div>

      <!-- Top Players Leaderboard -->
      <div v-if="showTopPlayers">
        <div class="game-selection">
          <label for="game">Select a Game:</label>
          <select v-model="selectedGame" @change="fetchTopPlayers">
            <option v-for="game in games" :key="game" :value="game">{{ game }}</option>
          </select>
        </div>

        <h3 class="leaderboard-heading">Top Players for {{ selectedGame }}</h3>
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in formattedLeaderboard" :key="player.id">
              <td class="rank">
                <span v-if="player.rank === 1">🥇</span>
                <span v-else-if="player.rank === 2">🥈</span>
                <span v-else-if="player.rank === 3">🥉</span>
                <span v-else>#{{ player.rank }}</span>
              </td>
              <td>{{ player.username }}</td>
              <td>{{ player.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Most Active Players Leaderboard -->
      <div v-else>
        <h3 class="leaderboard-heading">Most Active Players</h3>
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in mostActivePlayers" :key="player">
              <td class="rank">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span v-else>#{{ index + 1 }}</span>
              </td>
              <td>{{ player }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,

  data() {
    return {
      games: [
        "Flappy Bird", "Aim Trainer", "Memory Match", "Higher or Lower",
        "Sudoku Time Attack", "Type Racer",
        "Lucky Number Guess", "Math Speed"
      ],
      selectedGame: "Flappy Bird",
      topPlayers: [],
      mostActivePlayers: [],
      showTopPlayers: true,
      lowestScoreWins: ["Guess Number", "Number Sequence Challenge", "Memory Match", "Sudoku Time Attack", "Type Racer"]
    };
  },

  computed: {
    formattedLeaderboard() {
      let rank = 1;
      return this.topPlayers.map((player, index, arr) => {
        if (index > 0 && player.score !== arr[index - 1].score) {
          rank = index + 1;
        }
        return { ...player, rank };
      });
    }
  },

  mounted() {
    this.fetchTopPlayers();
    this.fetchMostActivePlayers();
    this.addScopedStyles();
  },

  methods: {
    async fetchTopPlayers() {
      try {
        const response = await fetch(`http://localhost:9091/api/leaderboard/${encodeURIComponent(this.selectedGame)}`);
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        
        let data = await response.json();
        this.topPlayers = data._embedded?.gameScoreList || [];

        if (this.lowestScoreWins.includes(this.selectedGame)) {
          this.topPlayers.sort((a, b) => a.score - b.score);
        } else {
          this.topPlayers.sort((a, b) => b.score - a.score);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    },

    async fetchMostActivePlayers() {
      try {
        const response = await fetch("http://localhost:9091/api/leaderboard/most-active");
        if (!response.ok) throw new Error("Failed to fetch most active players");

        let data = await response.json();
        this.mostActivePlayers = data.error ? [] : data;
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    },

    addScopedStyles() {
      if (!document.getElementById("leaderboard-styles")) {
        const style = document.createElement("style");
        style.id = "leaderboard-styles";
        style.innerHTML = `
          .leaderboard-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            max-width: 700px;
            margin: auto;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          .leaderboard-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2c3e50;
          }

          .toggle-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 15px;
          }

          .leaderboard-btn {
            padding: 10px 15px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
            background: #ddd;
          }

          .leaderboard-btn.active {
            background: #3498db;
            color: white;
          }

          .leaderboard-btn:hover {
            background: #2980b9;
          }

          .game-selection {
            margin-bottom: 20px;
          }

          .game-selection select {
            padding: 8px;
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid #ccc;
          }

          .leaderboard-heading {
            font-size: 22px;
            font-weight: bold;
            color: #34495e;
            margin: 20px 0 10px;
          }

          .leaderboard-table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            margin-top: 10px;
          }

          .leaderboard-table th, .leaderboard-table td {
            border: 1px solid #ddd;
            padding: 10px;
          }

          .leaderboard-table th {
            background: #ecf0f1;
            font-size: 16px;
          }

          .leaderboard-table tbody tr:hover {
            background: #f1f1f1;
          }

          .rank {
            font-weight: bold;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
};
