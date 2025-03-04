export default {
  template: `
    <div>
      <h2 class="text-center text-primary">Geometry Dash</h2>
      <canvas id="geometryCanvas" width="500" height="300"></canvas>
      <p class="text-center">Press Space to Jump!</p>
    </div>
  `,
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      const canvas = document.getElementById("geometryCanvas");
      const ctx = canvas.getContext("2d");

      let player = { x: 50, y: 250, size: 30, velocity: 0, gravity: 0.5, jump: -10 };
      let obstacles = [];
      let frame = 0;
      let gameOver = false;
      let score = 0;
      let startTime = Date.now();

      function spawnObstacle() {
        obstacles.push({ x: canvas.width, width: 20, height: Math.random() * 50 + 20 });
      }

      function update() {
        if (gameOver) return;

        player.velocity += player.gravity;
        player.y += player.velocity;

        if (player.y + player.size > canvas.height) {
          player.y = canvas.height - player.size;
          player.velocity = 0;
        }

        if (frame % 100 === 0) spawnObstacle();

        obstacles.forEach((obstacle) => {
          obstacle.x -= 3;
          if (player.x < obstacle.x + obstacle.width && player.x + player.size > obstacle.x && player.y + player.size > canvas.height - obstacle.height) {
            gameOver = true;
            console.log(`Survival Time: ${Date.now() - startTime}ms`);
          }
        });

        obstacles = obstacles.filter(o => o.x > 0);

        if (!gameOver) {
          frame++;
          score++;
          requestAnimationFrame(update);
        }

        draw();
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "blue";
        ctx.fillRect(player.x, player.y, player.size, player.size);

        ctx.fillStyle = "black";
        obstacles.forEach((o) => ctx.fillRect(o.x, canvas.height - o.height, o.width, o.height));

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 20);
      }

      document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && player.y + player.size === canvas.height) {
          player.velocity = player.jump;
        }
      });

      update();
    }
  }
};
