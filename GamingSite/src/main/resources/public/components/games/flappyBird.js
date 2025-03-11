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

      // Reset the game state
      function resetGame() {
        bird = { x: 50, y: 150, size: 15, gravity: 0.4, lift: -6, velocity: 0 };
        pipes = [];
        frame = 0;
        score = 0;
        gameOver = false;
        started = false;
        document.getElementById("startMessage").style.display = "block";
        document.getElementById("startMessage").innerText = "Press Space to Start";
        draw();
      }

      // Save score to the backend
      async function saveScore(username, score) {
        try {
          const response = await fetch("http://localhost:9091/api/games/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, game: "Flappy Bird", score: score })
          });
          if (!response.ok) {
            console.error("Failed to save score");
          }
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }

      // Start the game (hide the message and begin updates)
      function startGame() {
        if (!started) {
          started = true;
          document.getElementById("startMessage").style.display = "none";
          update();
        }
      }

      // Listen for the Space key to start or restart the game
      document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
          if (gameOver) {
            resetGame();
          } else {
            startGame();
          }
          bird.velocity = bird.lift;
        }
      });

      // Main game update loop
      function update() {
        if (!started || gameOver) return;

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Check for collision with floor or ceiling
        if (bird.y + bird.size > canvas.height || bird.y < 0) {
          gameOver = true;
        }

        // Add a new pipe every 100 frames
        if (frame % 100 === 0) {
          let gap = 90;
          let topHeight = Math.random() * (canvas.height - gap - 50) + 20;
          pipes.push({ x: canvas.width, topHeight: topHeight, bottomY: topHeight + gap, width: 50, passed: false });
        }

        // Update each pipe and check for collisions or scoring
        pipes.forEach(pipe => {
          pipe.x -= 2;

          if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.size > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.size > pipe.bottomY)
          ) {
            gameOver = true;
          }

          // Increase score if the bird passes the pipe
          if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score++;
          }
        });

        // Remove off-screen pipes
        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

        // If game is over, save score and show message
        if (!gameOver) {
          frame++;
          requestAnimationFrame(update);
        } else {
          const username = localStorage.getItem("username") || "Guest";
          saveScore(username, score);
          document.getElementById("startMessage").innerText = `Game Over! Score: ${score} | Press Space to Restart`;
          document.getElementById("startMessage").style.display = "block";
        }

        draw();
      }

      // Draw the game elements on the canvas
      function draw() {
        // Draw background
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw ground
        ctx.fillStyle = "#228B22";
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        // Draw pipes
        pipes.forEach(pipe => {
          ctx.fillStyle = "#228B22";
          ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
          ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);

          // Draw pipe accents
          ctx.fillStyle = "#006400";
          ctx.fillRect(pipe.x, pipe.topHeight - 10, pipe.width, 10);
          ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, 10);
        });

        // Draw bird
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw bird's eye
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(bird.x + 5, bird.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw score
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 25);
      }

      // Start with a reset
      resetGame();
    }
  }
};
