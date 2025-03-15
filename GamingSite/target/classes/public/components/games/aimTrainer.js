export default {
  template: `
  
  <br><br>
    <div class="game-container text-center">
      <h2 class="text-primary">Aim Trainer</h2>
      <p>Click the red targets as quickly as possible!</p>
      <p><strong>Time Left: {{ timeLeft }}s</strong></p>
      <canvas id="aimCanvas" width="500" height="400" class="game-canvas" style="border:1px solid black;"></canvas>
      <p><strong>Score: {{ score }}</strong></p>
    </div>
  `,
  data() {
    return {
      score: 0,
      timeLeft: 15,
      timerInterval: null,
      gameActive: false
    };
  },
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      const canvas = document.getElementById("aimCanvas");
      const ctx = canvas.getContext("2d");
      let target = { x: 100, y: 100, radius: 20 };

      const spawnTarget = () => {
        target.x = Math.random() * (canvas.width - 40) + 20;
        target.y = Math.random() * (canvas.height - 40) + 20;
        draw();
      };

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fill();
      };

      canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const distance = Math.sqrt((mouseX - target.x) ** 2 + (mouseY - target.y) ** 2);

        if (distance < target.radius) {
          if (!this.gameActive) {
            this.startTimer();
          }
          this.score++;
          spawnTarget();
        }
      });

      spawnTarget();
    },

    startTimer() {
      this.gameActive = true;
      this.timeLeft = 15;
      this.score = 0;

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.timerInterval);
          this.endGame();
        }
      }, 1000);
    },

    async saveScore(username, score) {
      try {
        const response = await fetch("http://localhost:9091/api/games/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, game: "Aim Trainer", score, gameType: "Precision" })
        });
        if (!response.ok) {
          console.error("Failed to save score");
        }
      } catch (error) {
        console.error("Error saving score:", error);
      }
    },

    endGame() {
      this.gameActive = false;
      const username = localStorage.getItem("username") || "Guest";
      this.saveScore(username, this.score);
      alert(`Game Over! Final Score: ${this.score}`);
    }
  }
};
