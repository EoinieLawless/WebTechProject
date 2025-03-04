export default {
  template: `
    <div class="game-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">
      <h2 class="text-center text-primary">Number Sequence Challenge</h2>
      <p class="text-center">Memorize the sequence and type it correctly.</p>
      <p id="sequence" class="text-center" style="font-size: 24px; font-weight: bold;"></p>
      <input type="text" id="userInput" placeholder="Enter the sequence here..." style="font-size: 18px; padding: 10px; border: 2px solid #333; border-radius: 5px; width: 50%; text-align: center;" disabled />
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Time: <span id="timer">0.00</span> seconds</p>
      <button id="startButton">Start</button>
    </div>
  `,
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      const sequenceElement = document.getElementById("sequence");
      const userInput = document.getElementById("userInput");
      const timerElement = document.getElementById("timer");
      const startButton = document.getElementById("startButton");
      
      let sequence = "";
      let startTime = null;
      let timerInterval = null;
      
      function generateSequence(length) {
        let numbers = "";
        for (let i = 0; i < length; i++) {
          numbers += Math.floor(Math.random() * 10);
        }
        return numbers;
      }
      
      function startGame() {
        sequence = generateSequence(6);
        sequenceElement.textContent = sequence;
        userInput.value = "";
        userInput.disabled = true;
        startTime = null;
        timerElement.textContent = "0.00";
        clearInterval(timerInterval);
        
        setTimeout(() => {
          sequenceElement.textContent = "";
          userInput.disabled = false;
          userInput.focus();
          startTimer();
        }, 3000);
      }
      
      function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
          timerElement.textContent = ((Date.now() - startTime) / 1000).toFixed(2);
        }, 10);
      }
      
      function checkCompletion() {
        if (userInput.value === sequence) {
          clearInterval(timerInterval);
          userInput.disabled = true;
          alert(`Correct! Time: ${timerElement.textContent} seconds`);
          setTimeout(startGame, 2000);
        }
      }
      
      userInput.addEventListener("input", checkCompletion);
      startButton.addEventListener("click", startGame);
    }
  }
};
