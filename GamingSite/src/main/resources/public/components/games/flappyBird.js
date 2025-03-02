export default {
  template: `
    <div>
      <h2 class="text-center text-primary">Flappy Bird</h2>
      <canvas id="flappyCanvas" width="480" height="320"></canvas>
      <p id="startMessage" class="text-center">Press Space to Start</p>
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
        bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.4, lift: -8, velocity: 0 };
        pipes = [];
        frame = 0;
        score = 0;
        gameOver = false;
        started = false;
        document.getElementById("startMessage").style.display = "block";
        draw(); // Show initial bird and pipes
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

        // Collision with ground or ceiling
        if (bird.y + bird.height > canvas.height || bird.y < 0) {
          gameOver = true;
        }

        // Add new pipes
        if (frame % 100 === 0) {
          let gap = 100;
          let topHeight = Math.random() * (canvas.height - gap - 50) + 20;
          pipes.push({ x: canvas.width, topHeight, bottomY: topHeight + gap, width: 40, passed: false });
        }

        // Move pipes and check collision
        pipes.forEach(pipe => {
          pipe.x -= 2;

          // Collision check
          if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
          ) {
            gameOver = true;
          }

          // Score if bird passes pipe
          if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score++;
          }
        });

        // Remove off-screen pipes
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bird
        ctx.fillStyle = "yellow";
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

        // Draw pipes
        ctx.fillStyle = "green";
        pipes.forEach(pipe => {
          ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
          ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
        });

        // Draw score
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 25);
      }

      resetGame();
    }
  }
};
