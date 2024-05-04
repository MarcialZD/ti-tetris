const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const timerElement = document.getElementById("timer");
const nextPieceElement = document.getElementById("next-piece");
let timerInterval;

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE";

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

let board = [];
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

let pieceSequence = [];
let nextPieceIndex = 0;

function generatePieceSequence() {
    pieceSequence = [];
    while (pieceSequence.length < 10) {
        const randomIndex = Math.floor(Math.random() * PIECES.length);
        pieceSequence.push(randomIndex);
    }
}

function getNextPiece() {
    const nextIndex = pieceSequence[nextPieceIndex];
    const [tetromino, color] = PIECES[nextIndex];
    nextPieceIndex = (nextPieceIndex + 1) % pieceSequence.length;
    return new Piece(tetromino, color);
}

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}

Piece.prototype.fill = function (color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.draw = function () {
    this.fill(this.color);
}

Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}

Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = getNextPiece();
        mostrarSiguientePieza();
    }
}

Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }
    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;

Piece.prototype.lock = function () {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            if (this.y + r < 0) {
                if (!gameOver) {
                    gameOver = true;
                    stopTimer();
                    alert("Game Over");
                    if (confirm("¿Quieres volver a jugar?")) {
                        resetGame();
                        return;
                    } else {
                        restartButton.style.display = "block";
                    }
                    break;
                }
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }
    for (let r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (let c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if (isRowFull) {
            for (let y = r; y > 1; y--) {
                for (let c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            for (let c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            score += 10;
        }
    }
    drawBoard();
    scoreElement.innerHTML = score;
}

Piece.prototype.collision = function (x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            if (newY < 0) {
                continue;
            }
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}

let dropStart = Date.now();
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

function startTimer() {
    let startTime = Date.now();
    timerInterval = setInterval(function () {
        let elapsedTime = Date.now() - startTime;
        let minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
        let seconds = Math.floor((elapsedTime / 1000) % 60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timerElement.textContent = minutes + ":" + seconds;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function startGame() {
    startTimer();
    generatePieceSequence();
    p = getNextPiece();
    drop();
    mostrarSiguientePieza();
    restartButton.style.display = "block";
}

function resetGame() {
    score = 0;
    gameOver = false;
    stopTimer();
    timerElement.textContent = "00:00";
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }
    drawBoard();
    scoreElement.innerHTML = score;

    if (gameOver && !confirm("¿Quieres volver a jugar?")) {
        restartButton.style.display = "block";
        return;
    }

    startTimer();
    generatePieceSequence();
    p = getNextPiece();
    drop();
    mostrarSiguientePieza();
}

function mostrarSiguientePieza() {
    const siguientePieza = pieceSequence[nextPieceIndex];
    const [tetromino, color] = PIECES[siguientePieza];
    const siguientePiezaCanvas = document.createElement("canvas");
    siguientePiezaCanvas.width = SQ * 4;
    siguientePiezaCanvas.height = SQ * 4;
    const siguientePiezaCtx = siguientePiezaCanvas.getContext("2d");
    for (let r = 0; r < tetromino[0].length; r++) {
        for (let c = 0; c < tetromino[0][0].length; c++) {
            if (tetromino[0][r][c]) {
                siguientePiezaCtx.fillStyle = color;
                siguientePiezaCtx.fillRect(c * SQ, r * SQ, SQ, SQ);
                siguientePiezaCtx.strokeStyle = "BLACK";
                siguientePiezaCtx.strokeRect(c * SQ, r * SQ, SQ, SQ);
            }
        }
    }
    nextPieceElement.innerHTML = "Proxima Pieza: ";
    nextPieceElement.appendChild(siguientePiezaCanvas);
}

document.getElementById("start-button").addEventListener("click", function () {
    var startButton = document.getElementById("start-button");
    startButton.style.display = "none";
    startGame();
});

restartButton.addEventListener("click", function () {
    resetGame();
});
