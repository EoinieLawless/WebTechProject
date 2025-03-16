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
        <ul class="leaderboard-list">
          <li v-for="(player, index) in formattedLeaderboard" :key="player.id">
            <span class="rank">
              <span v-if="player.rank === 1">🥇</span>
              <span v-else-if="player.rank === 2">🥈</span>
              <span v-else-if="player.rank === 3">🥉</span>
              <span v-else>#{{ player.rank }}</span>
            </span>
            {{ player.username }} - Score: {{ player.score }}
          </li>
        </ul>
      </div>

      <!-- Most Active Players Leaderboard -->
      <div v-else>
        <h3 class="leaderboard-heading">Most Active Players</h3>
        <ul class="leaderboard-list">
          <li v-for="(player, index) in mostActivePlayers" :key="player">
            <span class="rank">
              <span v-if="index === 0">🥇</span>
              <span v-else-if="index === 1">🥈</span>
              <span v-else-if="index === 2">🥉</span>
              <span v-else>#{{ index + 1 }}</span>
            </span>
            {{ player }}
          </li>
        </ul>
      </div>
    </div>
  `,
	data() {
		return {
			games: [
				"Flappy Bird",
				"Aim Trainer",
				"Memory Match",
				"Higher or Lower",
				"Number Sequence Challenge",
				"Sudoku Time Attack",
				"Type Racer",
				"Lucky Number Guess",
				"Math Speed"
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
		this.addScopedStyles(); // Ensure styles are applied
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

		    if (data.error) {
		      this.mostActivePlayers = [];
		      console.warn("No active players found");
		    } else {
		      this.mostActivePlayers = data;
		    }

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
            justify-content: center;
            text-align: center;
            padding: 20px;
            max-width: 600px;
            margin: auto;
            border-radius: 8px;
            background: #f9f9f9;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .leaderboard-title {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
          }

          .toggle-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 15px;
          }

          .leaderboard-btn {
            padding: 10px 15px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: #ddd;
            transition: background 0.3s;
          }

          .leaderboard-btn.active {
            background: #3498db;
            color: white;
          }

          .leaderboard-btn:hover {
            background: #2980b9;
            color: white;
          }

          .game-selection {
            margin-bottom: 20px;
          }

          .game-selection select {
            padding: 8px;
            font-size: 16px;
            border-radius: 4px;
            border: 1px solid #ccc;
          }

          .leaderboard-heading {
            font-size: 20px;
            font-weight: bold;
            margin-top: 15px;
            color: #34495e;
          }

          .leaderboard-list {
            list-style: none;
            padding: 0;
            width: 100%;
            max-width: 400px;
          }

          .leaderboard-list li {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #ecf0f1;
            margin: 5px 0;
            padding: 10px;
            border-radius: 5px;
            font-size: 16px;
          }

          .leaderboard-list li:hover {
            background: #d5dbdb;
          }

          .rank {
            font-weight: bold;
            font-size: 18px;
            width: 30px;
            display: inline-block;
          }
        `;
				document.head.appendChild(style);
			}
		}
	}
};
