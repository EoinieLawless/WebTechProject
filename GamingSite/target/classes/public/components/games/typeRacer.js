export default {
	template: `
    <div class="game-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">
      <h2 class="text-center text-primary">Type Racer</h2>
      <p class="text-center" id="sentence" style="font-size: 24px; font-weight: bold; max-width: 80%; text-align: center;"></p>
      <textarea id="typingArea" rows="3" cols="50" style="font-size: 18px; padding: 10px; border: 2px solid #333; border-radius: 5px; width: 80%; max-width: 600px;" placeholder="Start typing here..."></textarea>
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Time: <span id="timer">0.00</span> seconds</p>
    </div>
  `,
	mounted() {
		this.initGame();
	},
	methods: {
		initGame() {
			const sentences = [
				"A silent night reveals the whispers of the wandering wind.",
				"The road to wisdom is paved with questions and curiosity.",
				"Patience and persistence carve the path to every great achievement.",
				"Not every storm comes to destroy; some clear the path ahead.",
				"The key to true freedom lies in the courage to let go.",
				"Embrace each moment fully, for time waits for no one.",
				"Great minds do not think alike; they think beyond limits.",
				"Every masterpiece begins with a single imperfect stroke.",
				"Fear is only as strong as the power we give it.",
				"Dream big, work hard, and let success chase after you.",
				"Kindness costs nothing, yet its impact lasts a lifetime.",
				"A mind once stretched by a new idea never shrinks back.",
				"Fortune favors those who dare to take the first step.",
				"The stars shine brightest when the night is at its darkest.",
				"Wisdom grows not from success but from lessons in failure.",
				"A life well-lived is measured in moments, not in minutes.",
				"Even the smallest light can break through the deepest darkness.",
				"Words have power; choose them wisely and speak with intent.",
				"Hope is the seed that blossoms into a beautiful tomorrow.",
				"No mountain is too high when determination fuels your climb."
			];

			const sentenceElement = document.getElementById("sentence");
			const typingArea = document.getElementById("typingArea");
			const timerElement = document.getElementById("timer");

			let startTime = null;
			let timerInterval = null;

			function startGame() {
				const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
				sentenceElement.textContent = randomSentence;
				typingArea.value = "";
				typingArea.disabled = false;
				typingArea.focus();
				startTime = null;
				timerElement.textContent = "0.00";
				clearInterval(timerInterval);
			}

			function startTimer() {
				if (startTime === null) {
					startTime = Date.now();
					timerInterval = setInterval(() => {
						timerElement.textContent = ((Date.now() - startTime) / 1000).toFixed(2);
					}, 10);
				}
			}

			async function saveScore(username, time) {
				try {
					const response = await fetch("http://localhost:9091/api/games/save", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							username: username,
							game: "Type Racer",
							score: parseFloat(time),  // Score is the time taken (lower is better)
							gameType: "Precision"
						})
					});

					if (!response.ok) {
						console.error("Failed to save score");
					}
				} catch (error) {
					console.error("Error saving score:", error);
				}
			}

			function checkCompletion() {
				if (typingArea.value.trim() === sentenceElement.textContent.trim()) {
					clearInterval(timerInterval);
					typingArea.disabled = true;

					const timeTaken = timerElement.textContent;
					const username = localStorage.getItem("username") || "Guest";
					saveScore(username, timeTaken);

					alert(`Finished! Your time: ${timeTaken} seconds`);
					setTimeout(startGame, 2000); // Restart game after a short delay
				}
			}

			typingArea.addEventListener("input", () => {
				startTimer();
				checkCompletion();
			});

			startGame(); // Automatically start with a new sentence
		}
	}
};
