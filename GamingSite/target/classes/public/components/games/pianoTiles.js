export default {
  template: `
    <div>
      <h2 class="text-center text-primary">Piano Tiles</h2>
      <canvas id="pianoCanvas" width="400" height="600"></canvas>
      <p class="text-center">Click the black tiles!</p>
    </div>
  `,
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      const canvas = document.getElementById("pianoCanvas");
      const ctx = canvas.getContext("2d");

      let tiles = [];
      let speed = 3;
      let score = 0;
      let startTime = Date.now();

      function createTile() {
        tiles.push({ x: Math.random() * 350, y: 0, width: 50, height: 100 });
      }

      function update() {
        tiles.forEach(tile => tile.y += speed);

        tiles = tiles.filter(tile => tile.y < canvas.height);

        if (Math.random() < 0.02) createTile();

        draw();

        requestAnimationFrame(update);
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        tiles.forEach(tile => ctx.fillRect(tile.x, tile.y, tile.width, tile.height));

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 20);
      }

      canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for (let i = 0; i < tiles.length; i++) {
          let tile = tiles[i];
          if (mouseX > tile.x && mouseX < tile.x + tile.width && mouseY > tile.y && mouseY < tile.y + tile.height) {
            tiles.splice(i, 1);
            score++;
            console.log(`Reaction Time: ${Date.now() - startTime}ms`);
            break;
          }
        }
      });

      update();
    }
  }
};
