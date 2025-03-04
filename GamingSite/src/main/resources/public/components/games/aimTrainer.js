export default {
  template: `
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
      gameInterval: null,
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
      let startTime;

      const spawnTarget = () => {
        target.x = Math.random() * (canvas.width - 40) + 20;
        target.y = Math.random() * (canvas.height - 40) + 20;
        startTime = Date.now();
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
          this.gameActive = false;
        }
      }, 1000);
    }
  }
};
