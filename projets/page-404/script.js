const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
let currentPlayer = "heart";
let grid = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // lignes
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // colonnes
  [0, 4, 8],
  [2, 4, 6], // diagonales
];

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return { player: grid[a], combo }; // return both winner and combo
    }
  }
  if (!grid.includes(null)) return { player: "Egalité", combo: null };
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (grid[index] || checkWinner()) return;

  grid[index] = currentPlayer;
  e.target.classList.add("taken");
  e.target.classList.add("taken-" + currentPlayer);

  const result = checkWinner();
  if (!statusText) return;

  if (result) {
    const { player, combo } = result;

    if (player === "Egalité") {
      statusText.textContent = "Match nul !";
    } else {
      statusText.textContent = `🎉 Joueur ${player} a gagné ! 🎉`;

      // Highlight winning cells
      combo.forEach((i) => {
        const cell = board.querySelector(`[data-index='${i}']`);
        cell.classList.add("winner");
      });

      // Confetti explosion 🎊
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  } else {
    currentPlayer = currentPlayer === "heart" ? "star" : "heart";
    statusText.textContent = `À ${currentPlayer} de jouer`;
  }
}

function resetGame() {
  grid = Array(9).fill(null);
  currentPlayer = "heart";
  if (!statusText) return;
  statusText.textContent = "heart commence";
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken", "taken-heart", "taken-star");
  });
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

resetBtn.addEventListener("click", resetGame);

createBoard();
