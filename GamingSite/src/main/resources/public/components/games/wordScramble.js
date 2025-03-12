export default {
  template: `
    <div class="game-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">
      <h2 class="text-center text-primary">Word Scramble</h2>
      <p class="text-center">Unscramble the word and type the correct version.</p>
      <p id="scrambledWord" class="text-center" style="font-size: 24px; font-weight: bold;"></p>
      <input type="text" id="userInput" placeholder="Enter the correct word..." style="font-size: 18px; padding: 10px; border: 2px solid #333; border-radius: 5px; width: 50%; text-align: center;" disabled />
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Time: <span id="timer">0.00</span> seconds</p>
      <button id="startButton">Start</button>
    </div>
  `,
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      const words = ["banana", "orange", "grapes", "apple", "mango", "cherry", "peach", "strawberry", "pineapple", "blueberry"];
      const wordElement = document.getElementById("scrambledWord");
      const userInput = document.getElementById("userInput");
      const timerElement = document.getElementById("timer");
      const startButton = document.getElementById("startButton");
      
      let correctWord = "";
      let startTime = null;
      let timerInterval = null;
      
      function scrambleWord(word) {
        return word.split("").sort(() => Math.random() - 0.5).join("");
      }
      
      async function saveScore(username, time) {
        try {
          const response = await fetch("http://localhost:9091/api/games/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, game: "Word Scramble", score: time, gameType: "Puzzle" })
          });
          if (!response.ok) {
            console.error("Failed to save score");
          }
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
      
      function startGame() {
        correctWord = words[Math.floor(Math.random() * words.length)];
        wordElement.textContent = scrambleWord(correctWord);
        userInput.value = "";
        userInput.disabled = false;
        userInput.focus();
        startTime = null;
        timerElement.textContent = "0.00";
        clearInterval(timerInterval);
        startTimer();
      }
      
      function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
          timerElement.textContent = ((Date.now() - startTime) / 1000).toFixed(2);
        }, 10);
      }
      
      function checkCompletion() {
        if (userInput.value.toLowerCase() === correctWord) {
          clearInterval(timerInterval);
          userInput.disabled = true;
          const finalTime = parseFloat(timerElement.textContent);
          const username = localStorage.getItem("username") || "Guest";
          saveScore(username, finalTime);
          alert(`Correct! Time: ${finalTime} seconds`);
          setTimeout(startGame, 2000);
        }
      }
      
      userInput.addEventListener("input", checkCompletion);
      startButton.addEventListener("click", startGame);
    }
  }
};
