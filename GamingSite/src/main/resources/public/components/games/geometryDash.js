export default {
    template: `
     <div class="container mt-5 text-center">
        <h2 class="fw-bold text-primary mb-3">Geometry Dash Clone</h2>
        <canvas ref="gameCanvas" width="600" height="300" class="border"></canvas>
      </div>
    `,

    data() {
        return {
            isPlaying: false,
            player: { x: 50, y: 250, size: 20, velocityY: 0, onGround: true },
            gravity: 0.5,
            jumpStrength: -10,
            obstacles: [],
            obstacleWidth: 30,
            obstacleSpeed: 4,
            score: 0,
            gameInterval: null,
            ctx: null,
        };
    },

    mounted() {
        document.addEventListener("keydown", this.handleStartGame);
    },

    methods: {
        handleStartGame(event) {
            if (!this.isPlaying && event.key === " ") {
                this.startGame();
            }
        },

        startGame() {
            this.isPlaying = true;
            this.player.y = 250;
            this.player.velocityY = 0;
            this.player.onGround = true;
            this.obstacles = [];
            this.score = 0;
            this.ctx = this.$refs.gameCanvas.getContext("2d");
            document.addEventListener("keydown", this.jump);
            this.gameInterval = setInterval(this.updateGame, 20);
        },

        updateGame() {
            this.player.velocityY += this.gravity;
            this.player.y += this.player.velocityY;
            
            if (this.player.y >= 280) {
                this.player.y = 280;
                this.player.velocityY = 0;
                this.player.onGround = true;
            }

            // Add obstacles at intervals
            if (this.obstacles.length === 0 || this.obstacles[this.obstacles.length - 1].x < 400) {
                this.addObstacle();
            }

            // Move obstacles and check for collisions
            this.obstacles.forEach(obstacle => {
                obstacle.x -= this.obstacleSpeed;
                
                // Collision detection
                if (
                    this.player.x < obstacle.x + this.obstacleWidth &&
                    this.player.x + this.player.size > obstacle.x &&
                    this.player.y + this.player.size > obstacle.y &&
                    this.player.y < obstacle.y + obstacle.height
                ) {
                    this.endGame();
                }

                // Increase score when player successfully jumps over an obstacle
                if (!obstacle.passed && this.player.x > obstacle.x + this.obstacleWidth) {
                    obstacle.passed = true;
                    this.score++;
                }
            });

            // Remove obstacles that go off-screen
            this.obstacles = this.obstacles.filter(obstacle => obstacle.x > -this.obstacleWidth);
            
            this.drawGame();
        },

        addObstacle() {
            let height = Math.random() * 50 + 30;
            this.obstacles.push({ x: 600, y: 300 - height, width: this.obstacleWidth, height: height, passed: false });
        },

        jump(event) {
            if ((event.key === " " || event.key === "ArrowUp") && this.player.onGround) {
                this.player.velocityY = this.jumpStrength;
                this.player.onGround = false;
            }
        },

        drawGame() {
            this.ctx.clearRect(0, 0, 600, 300);
            this.ctx.fillStyle = "lightblue";
            this.ctx.fillRect(0, 0, 600, 300);
            
            // Draw player
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);
            
            // Draw obstacles
            this.ctx.fillStyle = "green";
            this.obstacles.forEach(obstacle => {
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });

            // Draw score
            this.ctx.fillStyle = "black";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        },

        async saveScore(username, score) {
            try {
                const response = await fetch("http://localhost:9091/api/games/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, game: "Geometry Dash", score, gameType: "Precision" })
                });
                if (!response.ok) {
                    console.error("Failed to save score");
                }
            } catch (error) {
                console.error("Error saving score:", error);
            }
        },

        endGame() {
            clearInterval(this.gameInterval);
            document.removeEventListener("keydown", this.jump);
            this.isPlaying = false;

            // Save score before showing game over message
            const username = localStorage.getItem("username") || "Guest";
            this.saveScore(username, this.score);
            
            alert(`Game Over! Score: ${this.score}`);
        }
    }
};
