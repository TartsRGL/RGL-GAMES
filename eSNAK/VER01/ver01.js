const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Game Settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const gameSpeed = 100; // milliseconds per frame (lower is faster)
// Game State
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval;
let isGameRunning = false;
// Snake
let velocityX = 0;
let velocityY = 0;
let snake = [];
let snakeTail = 5;
// Food
let foodX = 0;
let foodY = 0;
// Elements
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const finalScoreEl = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
// Initialize High Score
highScoreEl.innerText = highScore;
// Event Listeners
document.addEventListener('keydown', keyPush);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
function startGame() {
    isGameRunning = true;
    score = 0;
    scoreEl.innerText = score;
    snakeTail = 5;
    snake = [];
    // Start position
    const startX = Math.floor(tileCount / 2);
    const startY = Math.floor(tileCount / 2);
    // Initialize snake with head
    snake.push({ x: startX, y: startY });
    velocityX = 1; // Start moving right
    velocityY = 0;
    placeFood();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}
function gameLoop() {
    update();
    draw();
}
function update() {
    // Calculate new head position
    let headX = snake[snake.length - 1].x + velocityX;
    let headY = snake[snake.length - 1].y + velocityY;
    // Wrap walls (Tunnel effect) - optional, for now let's do wall collision DEATH
    // Wall Collision Check
    if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
        gameOver();
        return;
    }
    // Self Collision Check
    for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === headX && snake[i].y === headY) {
            gameOver();
            return;
        }
    }
    // Move Snake
    snake.push({ x: headX, y: headY });
    // Eating Food
    if (headX === foodX && headY === foodY) {
        score += 10;
        scoreEl.innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreEl.innerText = highScore;
        }
        // Grow snake (don't shift)
        placeFood();
    } else {
        // Remove tail if didn't eat
        snake.shift();
    }
}
function draw() {
    // Clear Screen
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw Food
    ctx.fillStyle = '#ff00ff'; // Magenta
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
    // Reset Shadow for next items if needed, or keep for global glow
    // Draw Snake
    ctx.fillStyle = '#00ffff'; // Cyan
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    for (let i = 0; i < snake.length; i++) {
        // Use a slightly different color for head?
        if (i === snake.length - 1) {
            ctx.fillStyle = '#ccffff'; // Lighter head
        } else {
            ctx.fillStyle = '#00ffff';
        }
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
    }
    // Reset shadow to avoid performance hit or bleeding
    ctx.shadowBlur = 0;
}
function placeFood() {
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);
    // Check if food spawned on snake body
    for (let part of snake) {
        if (part.x === foodX && part.y === foodY) {
            placeFood(); // Try again
            break;
        }
    }
}
function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');
}
function keyPush(evt) {
    if (!isGameRunning) return;
    // Prevent reversing directly
    switch (evt.keyCode) {
        case 37: // Left
        case 65: // A
            if (velocityX !== 1) { velocityX = -1; velocityY = 0; }
            break;
        case 38: // Up
        case 87: // W
            if (velocityY !== 1) { velocityX = 0; velocityY = -1; }
            break;
        case 39: // Right
        case 68: // D
            if (velocityX !== -1) { velocityX = 1; velocityY = 0; }
            break;
        case 40: // Down
        case 83: // S
            if (velocityY !== -1) { velocityX = 0; velocityY = 1; }
            break;
    }
}
    