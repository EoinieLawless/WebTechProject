export default {
  template: `
    <div class="game-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">
      <h2 class="text-center text-primary">Math Speed Test</h2>
      <p class="text-center">Solve as many problems as possible in 30 seconds!</p>
      <p id="mathProblem" class="text-center" style="font-size: 24px; font-weight: bold;"></p>
      <input type="text" id="userInput" placeholder="Enter your answer..." style="font-size: 18px; padding: 10px; border: 2px solid #333; border-radius: 5px; width: 50%; text-align: center;" disabled />
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Time Left: <span id="timer">30</span> seconds</p>
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Score: <span id="score">0</span></p>
      <button id="startButton">Start</button>
    </div>
  `,
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      const mathProblemElement = document.getElementById("mathProblem");
      const userInput = document.getElementById("userInput");
      const timerElement = document.getElementById("timer");
      const scoreElement = document.getElementById("score");
      const startButton = document.getElementById("startButton");
      
      let correctAnswer = null;
      let timeLeft = 30;
      let timerInterval = null;
      let score = 0;
      let gameActive = false;
      
      function generateMathProblem() {
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        let operators = ["+", "-", "*"];
        let operator = operators[Math.floor(Math.random() * operators.length)];
        
        correctAnswer = eval(`${num1} ${operator} ${num2}`);
        return `${num1} ${operator} ${num2} = ?`;
      }
      
      async function saveScore(username, score) {
        try {
          const response = await fetch("http://localhost:9091/api/games/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, game: "Math Speed", score: score, gameType: "Puzzle" })
          });
          if (!response.ok) {
            console.error("Failed to save score");
          }
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
      
      function startGame() {
        if (gameActive) return;
        gameActive = true;
        score = 0;
        scoreElement.textContent = score;
        timeLeft = 30;
        timerElement.textContent = timeLeft;
        userInput.value = "";
        userInput.disabled = false;
        userInput.focus();
        mathProblemElement.textContent = generateMathProblem();
        startButton.disabled = true;
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          timeLeft--;
          timerElement.textContent = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameActive = false;
            userInput.disabled = true;
            const username = localStorage.getItem("username") || "Guest";
            saveScore(username, score);
            alert(`Time's up! Your score: ${score}`);
            startButton.disabled = false;
          }
        }, 1000);
      }
      
      function checkAnswer() {
        if (!gameActive) return;
        if (parseInt(userInput.value) === correctAnswer) {
          score++;
          scoreElement.textContent = score;
          userInput.value = "";
          mathProblemElement.textContent = generateMathProblem();
        }
      }
      
      userInput.addEventListener("input", checkAnswer);
      startButton.addEventListener("click", startGame);
    }
  }
};