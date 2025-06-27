const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeSwitchBtn = document.getElementById("modeSwitchBtn");

const startBtn = document.getElementById("startBtn");
const playerForm = document.getElementById("playerForm");
const gameArea = document.getElementById("gameArea");

const playerXNameInput = document.getElementById("playerXName");
const playerONameInput = document.getElementById("playerOName");

let playerX = "Player X";
let playerO = "Player O";
let currentPlayer = "X";
let gameActive = false;
let vsAI = false;

let board = ["", "", "", "", "", "", "", "", ""];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  makeMove(index, currentPlayer);

  if (checkGameEnd()) return;

  if (vsAI && currentPlayer === "O") {
    const aiIndex = getBestMove();
    setTimeout(() => {
      makeMove(aiIndex, "O");
      checkGameEnd();
    }, 300);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());
  currentPlayer = player === "X" ? "O" : "X";
  const name = currentPlayer === "X" ? playerX : (vsAI ? "Tanmay" : playerO);
  statusText.textContent = `Player ${name}'s turn`;
}

function checkGameEnd() {
  const winner = getWinner();
  statusText.classList.remove("winner");

  if (winner) {
    const name = winner === "X" ? playerX : (vsAI ? "Tanmay" : playerO);
    statusText.textContent = `🎉 ${name} wins!`;
    statusText.classList.add("winner");
    gameActive = false;
    return true;
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "🤝 It's a draw!";
    statusText.classList.add("winner");
    gameActive = false;
    return true;
  }
  return false;
}

function getWinner() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${playerX}'s turn`;
  statusText.classList.remove("winner");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
}

function switchMode() {
  vsAI = !vsAI;
  playerO = vsAI ? "Tanmay" : playerONameInput.value || "Player O";
  resetGame();
  modeSwitchBtn.textContent = vsAI ? "Switch to 2 Player Mode" : "Switch to AI Mode";
}

function getBestMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  const winner = getWinner();
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

function startGame() {
  playerX = playerXNameInput.value || "Player X";
  playerO = vsAI ? "Tanmay" : (playerONameInput.value || "Player O");

  playerForm.style.display = "none";
  gameArea.style.display = "block";

  resetGame();
}

startBtn.addEventListener("click", startGame);
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);
modeSwitchBtn.addEventListener("click", switchMode);
