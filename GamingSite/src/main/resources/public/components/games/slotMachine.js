export default {
  template: `
    <div class="game-container">
      <h2 class="text-center text-primary">Slot Machine</h2>
      <p class="text-center text-secondary">Press Spin to try your luck!</p>
      
      <div class="slot-container">
        <div class="slot">{{ slots[0] }}</div>
        <div class="slot">{{ slots[1] }}</div>
        <div class="slot">{{ slots[2] }}</div>
      </div>

      <button class="btn btn-primary" @click="spin" :disabled="spinning">🎰 Spin</button>
      <p class="text-secondary">Score: {{ score }}</p>
      <p class="message" :class="{ 'win': message.includes('Win') || message.includes('JACKPOT'), 'lose': message.includes('Try') }">{{ message }}</p>
    </div>
  `,
  data() {
    return {
      symbols: ["🍒", "🍋", "🍊", "🍉", "7️⃣", "⭐", "🔔"],
      slots: ["?", "?", "?"],
      spinning: false,
      message: "Press Spin to Play!",
      score: 0
    };
  },
  methods: {
    async saveScore(username, score) {
      try {
        const response = await fetch("http://localhost:9091/api/games/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, game: "Slot Machine", score: score, gameType: "Luck" })
        });
        if (!response.ok) {
          console.error("Failed to save score");
        }
      } catch (error) {
        console.error("Error saving score:", error);
      }
    },
    
    spin() {
      this.spinning = true;
      this.message = "Spinning... 🎰";
      
      setTimeout(() => {
        this.slots = [
          this.randomSymbol(),
          this.randomSymbol(),
          this.randomSymbol()
        ];
        
        this.evaluateResult();
        this.spinning = false;
        
        const username = localStorage.getItem("username") || "Guest";
        this.saveScore(username, this.score);
      }, 1000);
    },
    
    randomSymbol() {
      return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    },
    
    evaluateResult() {
      const [s1, s2, s3] = this.slots;
      
      if (s1 === s2 && s2 === s3) {
        this.message = "🎉 JACKPOT! You matched all three! 🎉";
        this.score += 100;
      } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        this.message = "🏆 Small Win! Two symbols match!";
        this.score += 20;
      } else {
        this.message = "😢 Try again!";
        this.score -= 5;
        if (this.score < 0) this.score = 0;
      }
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
        .slot-container {
          display: flex;
          gap: 20px;
          margin: 20px;
          font-size: 50px;
          justify-content: center;
        }
        .slot {
          width: 80px;
          height: 80px;
          border: 3px solid black;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
        }
        .btn {
          padding: 10px 20px;
          font-size: 18px;
          cursor: pointer;
        }
        .message {
          font-size: 20px;
          margin-top: 10px;
          font-weight: bold;
        }
        .win {
          color: green;
        }
        .lose {
          color: red;
        }
      `;
      document.head.appendChild(style);
    }
  },
  mounted() {
    this.injectStyles();
  }
};