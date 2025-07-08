const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');

// Winning combinations
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Initialize game
function initGame() {
    board.fill(null);
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.textContent = `Your turn (${currentPlayer})`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Handle cell click
function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== null || !gameActive || currentPlayer !== 'X') {
        return;
    }

    makeMove(clickedCellIndex, currentPlayer);
    
    if (!checkWin() && !checkDraw()) {
        currentPlayer = 'O';
        statusDisplay.textContent = 'Computer thinking...';
        setTimeout(makeComputerMove, 500);
    }
}

// Make a move
function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    
    const gameWon = checkWin();
    if (gameWon) {
        gameActive = false;
        statusDisplay.textContent = player === 'X' ? 'You won!' : 'Computer won!';
        return;
    }
    
    if (checkDraw()) {
        gameActive = false;
        statusDisplay.textContent = 'Game ended in a draw!';
    }
}

// Computer move
function makeComputerMove() {
    if (!gameActive) return;

    // Simple AI - tries to win, then blocks, then random
    let move;
    
    //  Check for winning move
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === 'O' && board[b] === 'O' && board[c] === null) {
            move = c;
            break;
        }
        if (board[a] === 'O' && board[c] === 'O' && board[b] === null) {
            move = b;
            break;
        }
        if (board[b] === 'O' && board[c] === 'O' && board[a] === null) {
            move = a;
            break;
        }
    }
    
    //  Block player's winning move
    if (move === undefined) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] === 'X' && board[b] === 'X' && board[c] === null) {
                move = c;
                break;
            }
            if (board[a] === 'X' && board[c] === 'X' && board[b] === null) {
                move = b;
                break;
            }
            if (board[b] === 'X' && board[c] === 'X' && board[a] === null) {
                move = a;
                break;
            }
        }
    }
    
    //  Take center if available
    if (move === undefined && board[4] === null) {
        move = 4;
    }
    
    // 4. Random move
    if (move === undefined) {
        const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    makeMove(move, 'O');
    currentPlayer = 'X';
    if (gameActive) {
        statusDisplay.textContent = `Your turn (${currentPlayer})`;
    }
}

// Check for win
function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Check for draw
function checkDraw() {
    return board.every(cell => cell !== null);
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', initGame);

// Start game
initGame();