export default {
  template: `
    <div class="game-container">
      <h2 class="text-center text-primary">Lucky Number Guess</h2>
      <p class="text-center text-secondary">Guess the number between 1 and 100!</p>
      
      <input type="number" v-model="playerGuess" min="1" max="100" class="guess-input" :disabled="gameOver"/>
      <button class="btn btn-primary" @click="checkGuess" :disabled="gameOver || playerGuess === ''">Submit Guess</button>
      
      <p class="message" :class="{ 'win': message.includes('Win'), 'lose': message.includes('Out of') }">{{ message }}</p>
      <p class="attempts-left">Attempts Left: {{ attempts }}</p>

      <div class="past-guesses" v-if="guesses.length > 0">
        <h4>Past Guesses:</h4>
        <ul>
          <li v-for="guess in guesses" :key="guess" :class="{ 'correct': guess === secretNumber, 'wrong': guess !== secretNumber }">
            {{ guess }}
          </li>
        </ul>
      </div>
      
      <button class="btn btn-danger" @click="restartGame" v-if="gameOver">Restart</button>
    </div>
  `,
  data() {
    return {
      secretNumber: Math.floor(Math.random() * 100) + 1,
      playerGuess: "",
      attempts: 8,
      message: "Enter a number and submit your guess!",
      gameOver: false,
      guesses: []
    };
  },
  methods: {
    async saveScore(username, score) {
      try {
        const response = await fetch("http://localhost:9091/api/games/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, game: "Lucky Number Guess", score: score, gameType: "Luck" })
        });
        if (!response.ok) {
          console.error("Failed to save score");
        }
      } catch (error) {
        console.error("Error saving score:", error);
      }
    },
    
    checkGuess() {
      const guess = parseInt(this.playerGuess);
      if (isNaN(guess) || guess < 1 || guess > 100) {
        this.message = "⚠️ Enter a valid number between 1 and 100!";
        return;
      }
      
      this.guesses.push(guess);
      if (guess === this.secretNumber) {
        this.message = "🎉 You Win! The number was " + this.secretNumber + "!";
        this.gameOver = true;
        const username = localStorage.getItem("username") || "Guest";
        this.saveScore(username, this.attempts); // Score is remaining attempts
      } else if (guess < this.secretNumber) {
        this.message = "⬆️ Too Low! Try again.";
      } else {
        this.message = "⬇️ Too High! Try again.";
      }
      
      this.attempts--;
      if (this.attempts === 0 && guess !== this.secretNumber) {
        this.message = "😢 Out of Attempts! The number was " + this.secretNumber + ".";
        this.gameOver = true;
        const username = localStorage.getItem("username") || "Guest";
        this.saveScore(username, 0); // If player loses, score is 0
      }
      
      this.playerGuess = "";
    },
    
    restartGame() {
      this.secretNumber = Math.floor(Math.random() * 100) + 1;
      this.playerGuess = "";
      this.attempts = 8;
      this.message = "Enter a number and submit your guess!";
      this.gameOver = false;
      this.guesses = [];
    },
    
    injectStyles() {
      const style = document.createElement("style");
      style.innerHTML = `
        .game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }
        .guess-input {
          padding: 10px;
          font-size: 18px;
          margin: 10px;
          width: 100px;
          text-align: center;
        }
        
        .message {
          font-size: 20px;
          margin-top: 10px;
          font-weight: bold;
        }
        .attempts-left {
          font-size: 18px;
          margin-top: 10px;
        }
        .past-guesses {
          margin-top: 15px;
          font-size: 18px;
          text-align: left;
        }
        .past-guesses h4 {
          margin-bottom: 5px;
        }
        .past-guesses ul {
          list-style-type: none;
          padding: 0;
        }
        .past-guesses li {
          display: inline-block;
          margin: 5px;
          padding: 5px 10px;
          border-radius: 5px;
          font-weight: bold;
        }
        .correct {
          background-color: green;
          color: white;
        }
        .wrong {
          background-color: red;
          color: white;
        }
      `;
      document.head.appendChild(style);
    }
  },
  mounted() {
    this.injectStyles();
  }
};