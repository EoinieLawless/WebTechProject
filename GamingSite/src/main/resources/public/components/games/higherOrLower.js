export default {
	template: `
    <div class="game-container">
      <h2 class="game-title">Higher or Lower</h2>
      <p class="game-instructions">Guess if the next card is higher or lower!</p>
      <p class="game-instructions">The cards are from 1 to 20</p>
      <p class="game-instructions">Try and go on a winning streak!!!</p>
      
      <div class="card-container">
        <div class="card faded" v-if="prevCard">{{ prevCard }}</div>
        <div class="card active">{{ currentCard }}</div>
        <div class="card hidden-card" v-if="!revealNext">?</div>
        <div class="card" v-if="revealNext">{{ nextCard }}</div>
      </div>

      <div class="controls">
        <button class="game-btn game-btn-success" @click="makeGuess('higher')" :disabled="cooldown">Higher</button>
        <button class="game-btn game-btn-danger" @click="makeGuess('lower')" :disabled="cooldown">Lower</button>
      </div>

      <p class="game-message" v-if="gameOver">Incorrect! Streak is lost, try again in <span id="countdown">3</span> seconds...</p>
      <p class="game-score">Score: {{ score }}</p>
    </div>
  `,
	data() {
		return {
			deck: [],
			prevCard: null,
			currentCard: null,
			nextCard: null,
			score: 0,
			gameOver: false,
			cooldown: false,
			revealNext: false,
		};
	},
	mounted() {
		this.addScopedStyles(); 
		this.initGame();
	},
	methods: {
		async saveScore(username, score) {
			try {
				const response = await fetch("http://localhost:9091/api/games/save", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ username, game: "Higher or Lower", score: score, gameType: "Luck" })
				});
				if (!response.ok) {
					console.error("Failed to save score");
				}
			} catch (error) {
				console.error("Error saving score:", error);
			}
		},

		initGame() {
			this.deck = this.generateDeck();
			this.prevCard = null;
			this.currentCard = this.drawCard();
			this.nextCard = this.drawCard();
			this.score = 0;
			this.gameOver = false;
			this.cooldown = false;
			this.revealNext = false;
		},

		generateDeck() {
			let deck = [];
			for (let i = 1; i <= 20; i++) {
				deck.push(i);
			}
			return this.shuffle(deck);
		},

		shuffle(array) {
			return array.sort(() => Math.random() - 0.5);
		},

		drawCard() {
			return this.deck.length > 0 ? this.deck.pop() : this.generateDeck().pop();
		},

		makeGuess(choice) {
			this.revealNext = true;
			setTimeout(() => {
				let correct =
					(choice === "higher" && this.nextCard > this.currentCard) ||
					(choice === "lower" && this.nextCard < this.currentCard);

				if (correct) {
					this.score++;
					this.prevCard = this.currentCard;
					this.currentCard = this.nextCard;
					this.nextCard = this.drawCard();
					this.revealNext = false;
				} else {
					this.gameOver = true;
					const username = localStorage.getItem("username") || "Guest";
					this.saveScore(username, this.score);
					this.startCooldown();
				}
			}, 1000);
		},

		startCooldown() {
			this.cooldown = true;
			let countdown = 3;
			const timer = setInterval(() => {
				const countdownElement = document.getElementById("countdown");
				if (countdownElement) {
					countdownElement.textContent = countdown;
				}
				if (countdown === 0) {
					clearInterval(timer);
					this.initGame();
				}
				countdown--;
			}, 1000);
		},

		addScopedStyles() {
			if (!document.getElementById("higher-or-lower-styles")) {
				const style = document.createElement("style");
				style.id = "higher-or-lower-styles";
				style.innerHTML = `
          .game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
            padding: 20px;
          }

          .card-container {
            display: flex;
            gap: 20px;
            margin: 20px;
          }

          .game-container .card {
            width: 100px;
            height: 100px;
            border: 3px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            background-color: white;
            transition: background-color 0.3s, transform 0.2s;
          }

          .game-container .card.faded {
            opacity: 0.5;
            background-color: #ccc;
          }

          .game-container .card.hidden-card {
            background-color: #ddd;
            color: transparent;
          }

          .game-container .card.active {
            background-color: #ffeb3b;
            font-weight: bold;
            border-color: #d4af37;
          }

          .game-container .card:hover {
            transform: scale(1.1);
          }

          .game-container .controls {
            display: flex;
            gap: 15px;
            margin-top: 20px;
          }

          .game-container .game-btn {
            padding: 12px 24px;
            font-size: 18px;
            cursor: pointer;
            border: none;
            border-radius: 6px;
            transition: background 0.3s;
          }

          .game-container .game-btn-success {
            background-color: #28a745;
            color: white;
          }

          .game-container .game-btn-success:hover {
            background-color: #218838;
          }

          .game-container .game-btn-danger {
            background-color: #dc3545;
            color: white;
          }

          .game-container .game-btn-danger:hover {
            background-color: #c82333;
          }

          .game-container .game-message {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
            color: red;
          }

          .game-container .game-score {
            font-size: 16px;
            margin-top: 10px;
          }
        `;
				document.head.appendChild(style);
			}
		}
	}
};
