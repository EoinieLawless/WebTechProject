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
            flyingObjects: [],
            flyingSpeed: 5,
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
            this.flyingObjects = [];
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

            if (this.obstacles.length === 0 || this.obstacles[this.obstacles.length - 1].x < 400) {
                this.addObstacle();
            }

            this.obstacles.forEach(obstacle => {
                obstacle.x -= this.obstacleSpeed;
                
                if (
                    this.player.x < obstacle.x + this.obstacleWidth &&
                    this.player.x + this.player.size > obstacle.x &&
                    this.player.y + this.player.size > obstacle.y &&
                    this.player.y < obstacle.y + obstacle.height
                ) {
                    this.endGame();
                }
            });
            
            this.obstacles = this.obstacles.filter(obstacle => obstacle.x > -this.obstacleWidth);
            
            if (this.flyingObjects.length === 0 || this.flyingObjects[this.flyingObjects.length - 1].x < 400) {
                this.addFlyingObject();
            }
            
            this.flyingObjects.forEach(flyObj => {
                flyObj.x -= this.flyingSpeed;
            });
            
            this.flyingObjects = this.flyingObjects.filter(flyObj => flyObj.x > -30);
            
            this.flyingObjects.forEach(flyObj => {
                if (
                    this.player.x < flyObj.x + 20 &&
                    this.player.x + this.player.size > flyObj.x &&
                    this.player.y < flyObj.y + 20 &&
                    this.player.y + this.player.size > flyObj.y
                ) {
                    this.endGame();
                }
            });
            
            this.drawGame();
        },

        addObstacle() {
            let height = Math.random() * 50 + 30;
            this.obstacles.push({ x: 600, y: 300 - height, width: this.obstacleWidth, height: height });
        },
        
        addFlyingObject() {
            let yPos = Math.random() * 200 + 50;
            this.flyingObjects.push({ x: 600, y: yPos, width: 20, height: 20 });
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
            
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);
            
            this.ctx.fillStyle = "green";
            this.obstacles.forEach(obstacle => {
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
            
            this.ctx.fillStyle = "purple";
            this.flyingObjects.forEach(flyObj => {
                this.ctx.fillRect(flyObj.x, flyObj.y, flyObj.width, flyObj.height);
            });
            
            this.ctx.fillStyle = "black";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        },

        endGame() {
            clearInterval(this.gameInterval);
            document.removeEventListener("keydown", this.jump);
            this.isPlaying = false;
            alert("Game Over! Score: " + this.score);
        },
    }
};
