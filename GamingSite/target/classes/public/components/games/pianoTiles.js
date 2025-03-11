export default {
  template: `
    <div class="game-container">
      <h2 class="text-center text-primary">Piano Tiles</h2>
      <p class="text-center">Click the black tiles before they reach the bottom!</p>

      <button id="startButton" class="btn btn-success" @click="startGame">Start Game</button>

      <div class="game-wrapper">
        <canvas id="pianoCanvas" width="400" height="600"></canvas>
      </div>

      <p class="text-center">Score: <span id="score">0</span></p>
    </div>
  `,
  data() {
    return {
      gameRunning: false,
      tiles: [],
      speed: 2,
      acceleration: 0.01,
      score: 0,
      columns: [0, 100, 200, 300], // Four columns
      lastColumns: [],
      animationFrame: null
    };
  },
  methods: {
    startGame() {
      this.gameRunning = true;
      document.getElementById("startButton").style.display = "none"; // Hide start button
      this.tiles = [];
      this.speed = 2;
      this.score = 0;
      document.getElementById("score").innerText = this.score;
      this.generateInitialTiles(); // Start with tiles already falling
      this.updateGame();
    },

    generateInitialTiles() {
      this.tiles = [];
      for (let i = 0; i < 4; i++) {
        this.createTile(-i * 150); // Tiles start off-screen and fall into view
      }
    },

    createTile(yPosition = 0) {
      let availableColumns = this.columns.filter(col => !this.lastColumns.includes(col));
      let randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];

      if (this.lastColumns.length >= 2) {
        this.lastColumns.shift(); // Prevent overlapping in consecutive tiles
      }
      this.lastColumns.push(randomColumn);

      this.tiles.push({ x: randomColumn, y: yPosition, width: 100, height: 120 });
    },

    updateGame() {
      if (!this.gameRunning) return;

      const canvas = document.getElementById("pianoCanvas");
      const ctx = canvas.getContext("2d");

      this.tiles.forEach(tile => tile.y += this.speed);

      // Check if any tile has fully exited the screen
      if (this.tiles.some(tile => tile.y + tile.height >= canvas.height)) {
        this.gameOver();
        return;
      }

      // Increase speed gradually
      this.speed += this.acceleration;

      // Add new tiles when the last tile reaches a certain point
      if (this.tiles.length === 0 || this.tiles[this.tiles.length - 1].y > 150) {
        this.createTile();
      }

      // Draw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines (column barriers)
      ctx.strokeStyle = "gray";
      for (let x = 100; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw tiles
      ctx.fillStyle = "black";
      this.tiles.forEach(tile => ctx.fillRect(tile.x, tile.y, tile.width, tile.height));

      // Update score display
      document.getElementById("score").innerText = this.score;

      // Continue animation loop
      this.animationFrame = requestAnimationFrame(() => this.updateGame());
    },

    gameOver() {
      this.gameRunning = false;
      cancelAnimationFrame(this.animationFrame);

      // Save score before showing alert
      const username = localStorage.getItem("username") || "Guest";
      this.saveScore(username, this.score);

      alert(`Game Over! Final Score: ${this.score}`);
      document.getElementById("startButton").style.display = "block"; // Show start button
    },

    async saveScore(username, score) {
      try {
        const response = await fetch("http://localhost:9091/api/games/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, game: "Piano Tiles", score, gameType: "Precision" })
        });
        if (!response.ok) {
          console.error("Failed to save score");
        }
      } catch (error) {
        console.error("Error saving score:", error);
      }
    },

    handleTileClick(event) {
      if (!this.gameRunning) return;

      const canvas = document.getElementById("pianoCanvas");
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (let i = 0; i < this.tiles.length; i++) {
        let tile = this.tiles[i];
        if (mouseX > tile.x && mouseX < tile.x + tile.width &&
            mouseY > tile.y && mouseY < tile.y + tile.height) {
          this.tiles.splice(i, 1);
          this.score++;
          break;
        }
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
        .game-wrapper {
          display: flex;
          justify-content: center;
          border: 3px solid black;
          padding: 10px;
          background-color: white;
        }
        canvas {
          background-color: lightgray;
          cursor: pointer;
        }
        .btn {
          padding: 10px 20px;
          font-size: 18px;
          cursor: pointer;
          margin-bottom: 10px;
        }
      `;
      document.head.appendChild(style);
    }
  },
  mounted() {
    this.injectStyles();
    document.getElementById("pianoCanvas").addEventListener("click", this.handleTileClick);
  }
};
