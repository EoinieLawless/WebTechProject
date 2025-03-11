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
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "The only thing we have to fear is fear itself.",
        "Do not dwell in the past, do not dream of the future.",
        "Happiness depends upon ourselves.",
        "Life is really simple, but we insist on making it complicated.",
        "Success is not final, failure is not fatal.",
        "Keep your face always toward the sunshine and shadows will fall behind you."
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

      function checkCompletion() {
        if (typingArea.value.trim() === sentenceElement.textContent.trim()) {
          clearInterval(timerInterval);
          typingArea.disabled = true;
          alert(`Finished! Your time: ${timerElement.textContent} seconds`);
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
