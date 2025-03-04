export default {
  template: `
    <div class="flappy-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">
      <h2 class="text-center text-primary">Flappy Bird</h2>
      <canvas id="flappyCanvas" width="480" height="320" style="border:1px solid black;"></canvas>
      <p id="startMessage" class="text-center text-secondary">Press Space to Start</p>
    </div>
  `,
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      const canvas = document.getElementById("flappyCanvas");
      const ctx = canvas.getContext("2d");
      let bird, pipes, frame, score, gameOver, started;

      function resetGame() {
        bird = { x: 50, y: 150, size: 15, gravity: 0.4, lift: -6, velocity: 0 };
        pipes = [];
        frame = 0;
        score = 0;
        gameOver = false;
        started = false;
        document.getElementById("startMessage").style.display = "block";
        draw();
      }

      function startGame() {
        if (!started) {
          started = true;
          document.getElementById("startMessage").style.display = "none";
          update();
        }
      }

      document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
          if (gameOver) resetGame();
          else startGame();
          bird.velocity = bird.lift;
        }
      });

      function update() {
        if (!started || gameOver) return;

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.size > canvas.height || bird.y < 0) {
          gameOver = true;
        }

        if (frame % 100 === 0) {
          let gap = 90;
          let topHeight = Math.random() * (canvas.height - gap - 50) + 20;
          pipes.push({ x: canvas.width, topHeight, bottomY: topHeight + gap, width: 50, passed: false });
        }

        pipes.forEach(pipe => {
          pipe.x -= 2;

          if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.size > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.size > pipe.bottomY)
          ) {
            gameOver = true;
          }

          if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score++;
          }
        });

        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

        if (!gameOver) {
          frame++;
          requestAnimationFrame(update);
        } else {
          document.getElementById("startMessage").innerText = `Game Over! Score: ${score} | Press Space to Restart`;
          document.getElementById("startMessage").style.display = "block";
        }

        draw();
      }

      function draw() {
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#228B22";
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        pipes.forEach(pipe => {
          ctx.fillStyle = "#228B22";
          ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
          ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);

          ctx.fillStyle = "#006400";
          ctx.fillRect(pipe.x, pipe.topHeight - 10, pipe.width, 10);
          ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, 10);
        });

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(bird.x + 5, bird.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 25);
      }

      resetGame();
    }
  }
};
