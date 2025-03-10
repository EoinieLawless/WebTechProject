export default {
  template: `
    <div class="game-container">
      <h2 class="text-center text-primary">Higher or Lower</h2>
      <p class="text-center text-secondary">Guess if the next card is higher or lower!</p>
	  <p class="text-center text-secondary">The cards are from 1 to 20</p>
	  <p class="text-center text-secondary">Try and go on a winning streak!!!</p>
      
      <!-- Card Layout -->
      <div class="card-container">
        <div class="card" :class="{ 'faded': !prevCard }">{{ prevCard || "?" }}</div>
        <div class="card active">{{ currentCard }}</div>
        <div class="card" :class="{ 'hidden-card': !revealNext }">{{ revealNext ? nextCard : "?" }}</div>
      </div>

      <!-- Controls -->
      <div class="controls" v-if="!gameOver">
        <button class="btn btn-success" @click="makeGuess('higher')" :disabled="cooldown">Higher</button>
        <button class="btn btn-danger" @click="makeGuess('lower')" :disabled="cooldown">Lower</button>
      </div>

      <!-- Messages -->
      <p class="message text-danger" v-if="gameOver">Failed! Try again in <span id="countdown">5</span> seconds...</p>
      <p class="text-secondary">Score: {{ score }}</p>
    </div>
  `,
  data() {
    return {
      deck: [],
      prevCard: null,
      currentCard: null,
      nextCard: null,
      score: 0,
      gameOver: false,
      cooldown: false,
      revealNext: false,
    };
  },
  mounted() {
    this.initGame();
    this.injectStyles();
  },
  methods: {
    initGame() {
      this.deck = this.generateDeck();
      this.prevCard = null;
      this.currentCard = this.drawCard();
      this.nextCard = this.drawCard();
      this.score = 0;
      this.gameOver = false;
      this.cooldown = false;
      this.revealNext = false;
    },
    generateDeck() {
      let deck = [];
      for (let i = 1; i <= 20; i++) { // Numbers between 1 and 20
        deck.push(i);
      }
      return this.shuffle(deck);
    },
    shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    },
    drawCard() {
      return this.deck.length > 0 ? this.deck.pop() : this.generateDeck().pop();
    },
    makeGuess(choice) {
      this.revealNext = true;
      setTimeout(() => {
        let correct =
          (choice === "higher" && this.nextCard > this.currentCard) ||
          (choice === "lower" && this.nextCard < this.currentCard);

        if (correct) {
          this.score++;
          this.prevCard = this.currentCard;
          this.currentCard = this.nextCard;
          this.nextCard = this.drawCard();
          this.revealNext = false;
        } else {
          this.gameOver = true;
          this.startCooldown();
        }
      }, 1000);
    },
    startCooldown() {
      this.cooldown = true;
      let countdown = 5;
      const timer = setInterval(() => {
        document.getElementById("countdown").textContent = countdown;
        if (countdown === 0) {
          clearInterval(timer);
          this.initGame();
        }
        countdown--;
      }, 1000);
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
        }
        .card-container {
          display: flex;
          gap: 20px;
          margin: 20px;
        }
        .card {
          width: 100px;
          height: 100px;
          border: 2px solid black;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 40px;
          background-color: #eee;
          transition: background-color 0.3s;
        }
        .faded {
          opacity: 0.5;
        }
        .hidden-card {
          background-color: #ddd;
          color: transparent;
        }
        .active {
          background-color: #ffeb3b;
          font-weight: bold;
        }
        .btn {
          margin: 10px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: none;
        }
        .btn-success {
          background-color: #28a745;
          color: white;
        }
        .btn-danger {
          background-color: #dc3545;
          color: white;
        }
        .message {
          font-size: 18px;
          font-weight: bold;
          margin-top: 10px;
        }
      `;
      document.head.appendChild(style);
    }
  }
};
