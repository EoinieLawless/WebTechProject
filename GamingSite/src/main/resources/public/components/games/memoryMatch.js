export default {
	template: `
    <div class="game-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">
      <h2 class="text-center text-primary">Memory Match</h2>
      <p class="text-center">Flip two cards at a time to find matching pairs.</p>
      <div id="gameBoard" class="game-board" style="display: grid; grid-template-columns: repeat(4, 100px); grid-gap: 10px; margin-top: 20px;"></div>
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Moves: <span id="moves">0</span></p>
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Time: <span id="timer">0.00</span> seconds</p>
    </div>
  `,
	mounted() {
		this.initGame();
	},
	methods: {
		initGame() {
			const symbols = ["🍎", "🍎", "🍌", "🍌", "🍉", "🍉", "🍇", "🍇", "🍓", "🍓", "🍒", "🍒", "🥝", "🥝", "🍍", "🍍"];
			let shuffledSymbols = symbols.sort(() => Math.random() - 0.5);
			let gameBoard = document.getElementById("gameBoard");
			let movesElement = document.getElementById("moves");
			let timerElement = document.getElementById("timer");

			let firstCard = null;
			let secondCard = null;
			let moves = 0;
			let matches = 0;
			let startTime = null;
			let timerInterval = null;

			function startTimer() {
				if (!startTime) {
					startTime = Date.now();
					timerInterval = setInterval(() => {
						timerElement.textContent = ((Date.now() - startTime) / 1000).toFixed(2);
					}, 10);
				}
			}

			async function saveScore(username, moves, time) {
				try {
					const response = await fetch("http://localhost:9091/api/games/save", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ username: username, game: "Memory Match", score: time, gameType: "Puzzle" })
					});
					if (!response.ok) {
						console.error("Failed to save score");
					}
				} catch (error) {
					console.error("Error saving score:", error);
				}
			}

			function createCard(symbol) {
				let card = document.createElement("div");
				card.classList.add("card");
				card.style.width = "100px";
				card.style.height = "100px";
				card.style.border = "2px solid black";
				card.style.display = "flex";
				card.style.justifyContent = "center";
				card.style.alignItems = "center";
				card.style.fontSize = "40px";
				card.style.backgroundColor = "#eee";
				card.dataset.symbol = symbol;
				card.textContent = "?";

				card.addEventListener("click", () => {
					startTimer();
					if (card.textContent !== "?" || secondCard) return;

					card.textContent = symbol;

					if (!firstCard) {
						firstCard = card;
					} else {
						secondCard = card;
						moves++;
						movesElement.textContent = moves;

						if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
							matches++;
							firstCard = null;
							secondCard = null;
							if (matches === symbols.length / 2) {
								clearInterval(timerInterval);
								const finalTime = parseFloat(timerElement.textContent);
								const username = localStorage.getItem("username") || "Guest";
								saveScore(username, moves, finalTime);
								alert(`You won! Time: ${finalTime} seconds, Moves: ${moves}`);
								setTimeout(initGame, 2000);
							}
						} else {
							setTimeout(() => {
								firstCard.textContent = "?";
								secondCard.textContent = "?";
								firstCard = null;
								secondCard = null;
							}, 1000);
						}
					}
				});
				return card;
			}

			function initGame() {
				gameBoard.innerHTML = "";
				shuffledSymbols = symbols.sort(() => Math.random() - 0.5);
				moves = 0;
				matches = 0;
				startTime = null;
				clearInterval(timerInterval);
				timerElement.textContent = "0.00";
				movesElement.textContent = "0";
				shuffledSymbols.forEach(symbol => {
					gameBoard.appendChild(createCard(symbol));
				});
			}

			initGame();
		}
	}
};
