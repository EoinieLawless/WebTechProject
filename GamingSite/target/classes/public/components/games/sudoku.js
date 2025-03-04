export default {
  template: `
    <div class="game-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100vh;">
      <h2 class="text-center text-primary">Sudoku Time Attack</h2>
      <p class="text-center">Fill in the missing numbers as fast as possible!</p>
      <div id="sudokuBoard" class="sudoku-board" style="display: grid; grid-template-columns: repeat(4, 50px); grid-gap: 5px; margin-top: 20px;"></div>
      <p class="text-center" style="font-size: 20px; font-weight: bold;">Time: <span id="timer">0.00</span> seconds</p>
      <button id="startButton">Start</button>
    </div>
  `,
  mounted() {
    this.initGame();
  },
  methods: {
    initGame() {
      const boardElement = document.getElementById("sudokuBoard");
      const timerElement = document.getElementById("timer");
      const startButton = document.getElementById("startButton");
      
      let board = [];
      let solution = [];
      let startTime = null;
      let timerInterval = null;
      
      function generateSudoku() {
        let baseBoard = [
          [1, 2, 3, 4],
          [3, 4, 1, 2],
          [2, 1, 4, 3],
          [4, 3, 2, 1]
        ];
        solution = baseBoard.map(row => [...row]);
        
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (Math.random() > 0.5) {
              baseBoard[i][j] = "";
            }
          }
        }
        return baseBoard;
      }
      
      function startGame() {
        board = generateSudoku();
        boardElement.innerHTML = "";
        startTime = null;
        timerElement.textContent = "0.00";
        clearInterval(timerInterval);
        
        board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            let input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.style.width = "50px";
            input.style.height = "50px";
            input.style.fontSize = "20px";
            input.style.textAlign = "center";
            input.style.border = "2px solid black";
            
            if (cell !== "") {
              input.value = cell;
              input.disabled = true;
              input.style.backgroundColor = "#ddd";
            } else {
              input.addEventListener("input", () => checkCompletion());
            }
            
            boardElement.appendChild(input);
          });
        });
        
        startTimer();
      }
      
      function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
          timerElement.textContent = ((Date.now() - startTime) / 1000).toFixed(2);
        }, 10);
      }
      
      function checkCompletion() {
        let inputs = Array.from(boardElement.getElementsByTagName("input"));
        let isCorrect = true;
        
        inputs.forEach((input, index) => {
          let row = Math.floor(index / 4);
          let col = index % 4;
          if (!input.disabled && input.value != solution[row][col]) {
            isCorrect = false;
          }
        });
        
        if (isCorrect) {
          clearInterval(timerInterval);
          alert(`You solved it! Time: ${timerElement.textContent} seconds`);
          setTimeout(startGame, 2000);
        }
      }
      
      startButton.addEventListener("click", startGame);
    }
  }
};
