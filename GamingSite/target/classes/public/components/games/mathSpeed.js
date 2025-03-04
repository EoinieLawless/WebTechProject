export default {
  template: `
    <div class="game-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">
      <h2 class="text-center text-primary">Math Speed Test</h2>
      <p class="text-center">Solve as many problems as possible in 30 seconds!</p>
      <p id="mathProblem" class="text-center" style="font-size: 24px; font-weight: bold;"></p>
      <input type="text" id="userInput" placeholder="Enter your answer..." style="font-size: 18px; padding: 10px; border: 2px solid #333; border-radius: 5px; width: 50%; text-align: center;" />
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Time Left: <span id="timer">30</span> seconds</p>
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Score: <span id="score">0</span></p>
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
      
      let correctAnswer = null;
      let timeLeft = 30;
      let timerInterval = null;
      let score = 0;
      let questionsAnswered = 0;
      
      function generateMathProblem() {
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        let operators = ["+", "-", "*"];
        let operator = operators[Math.floor(Math.random() * operators.length)];
        
        correctAnswer = eval(`${num1} ${operator} ${num2}`);
        return `${num1} ${operator} ${num2} = ?`;
      }
      
      function startGame() {
        score = 0;
        questionsAnswered = 0;
        scoreElement.textContent = score;
        timeLeft = 30;
        timerElement.textContent = timeLeft;
        userInput.value = "";
        userInput.focus();
        generateNextQuestion();
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          timeLeft--;
          timerElement.textContent = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            userInput.disabled = true;
            alert(`Time's up! Your score: ${score}`);
            setTimeout(startGame, 2000);
          }
        }, 1000);
      }
      
      function generateNextQuestion() {
        if (questionsAnswered >= 5 || timeLeft <= 0) {
          return;
        }
        mathProblemElement.textContent = generateMathProblem();
        userInput.value = "";
        userInput.disabled = false;
      }
      
      function checkAnswer() {
        if (parseInt(userInput.value) === correctAnswer) {
          score++;
          scoreElement.textContent = score;
          questionsAnswered++;
          if (questionsAnswered < 5) {
            generateNextQuestion();
          } else {
            clearInterval(timerInterval);
            alert(`You completed 5 questions! Your score: ${score}`);
            setTimeout(startGame, 2000);
          }
        }
      }
      
      userInput.addEventListener("input", checkAnswer);
      startGame();
    }
  }
};
