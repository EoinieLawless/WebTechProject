export default {
  template: `
    <div class="game-container">
      <h2 class="text-center text-primary">Slot Machine</h2>
      <p class="text-center text-secondary">Press Spin to try your luck!</p>
      
      <!-- Slot Display -->
      <div class="slot-container">
        <div class="slot">{{ slots[0] }}</div>
        <div class="slot">{{ slots[1] }}</div>
        <div class="slot">{{ slots[2] }}</div>
      </div>

      <!-- Controls -->
      <button class="btn btn-primary" @click="spin" :disabled="spinning">🎰 Spin</button>
      <p class="message" :class="{ 'win': message.includes('Win'), 'lose': message.includes('Try') }">{{ message }}</p>
    </div>
  `,
  data() {
    return {
      symbols: ["🍒", "🍋", "🍊", "🍉", "7️⃣", "⭐", "🔔"],
      slots: ["?", "?", "?"],
      spinning: false,
      message: "Press Spin to Play!",
    };
  },
  methods: {
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
      }, 1000);
    },
    randomSymbol() {
      return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    },
    evaluateResult() {
      const [s1, s2, s3] = this.slots;

      if (s1 === s2 && s2 === s3) {
        this.message = "🎉 JACKPOT! You matched all three! 🎉";
      } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        this.message = "🏆 Small Win! Two symbols match!";
      } else {
        this.message = "😢 Try again!";
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
