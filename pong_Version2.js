const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Responsive canvas
function resizeCanvas() {
  const ratio = 800 / 500;
  let width = Math.min(window.innerWidth * 0.95, 800);
  let height = width / ratio;
  if (height > window.innerHeight * 0.7) {
    height = window.innerHeight * 0.7;
    width = height * ratio;
  }
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 30;
const AI_X = 800 - 30 - PADDLE_WIDTH;
const PADDLE_SPEED = 8;
const BALL_SPEED = 6;

// Game state
let playerY = (500 - PADDLE_HEIGHT) / 2;
let aiY = (500 - PADDLE_HEIGHT) / 2;
let ballX = (800 - BALL_SIZE) / 2;
let ballY = (500 - BALL_SIZE) / 2;
let ballVX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color = "#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function resetBall() {
  ballX = (800 - BALL_SIZE) / 2;
  ballY = (500 - BALL_SIZE) / 2;
  ballVX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

function update() {
  // Ball movement
  ballX += ballVX;
  ballY += ballVY;

  // Wall collision (top/bottom)
  if (ballY <= 0) {
    ballY = 0;
    ballVY = -ballVY;
  }
  if (ballY + BALL_SIZE >= 500) {
    ballY = 500 - BALL_SIZE;
    ballVY = -ballVY;
  }

  // Left paddle collision
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballX >= PLAYER_X &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballVX = -ballVX;
    // Add some randomness
    ballVY += (Math.random() - 0.5) * 4;
  }

  // Right paddle collision
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballX + BALL_SIZE <= AI_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_SIZE;
    ballVX = -ballVX;
    ballVY += (Math.random() - 0.5) * 4;
  }

  // Score if out of bounds
  if (ballX < 0 || ballX > 800) {
    resetBall();
  }

  // AI paddle movement
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
    aiY += PADDLE_SPEED * 0.9;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
    aiY -= PADDLE_SPEED * 0.9;
  }
  // Constrain AI paddle
  aiY = Math.max(0, Math.min(500 - PADDLE_HEIGHT, aiY));
}

function render() {
  // Clear
  ctx.clearRect(0, 0, 800, 500);

  // Draw paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0ff");
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#f00");

  // Draw ball
  drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, "#fff");
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function (evt) {
  if (evt.buttons !== undefined && evt.buttons === 0) return;
  const rect = canvas.getBoundingClientRect();
  // Scale mouse Y to game coordinates
  const scaleY = 500 / rect.height;
  const mouseY = (evt.clientY - rect.top) * scaleY;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  playerY = Math.max(0, Math.min(500 - PADDLE_HEIGHT, playerY));
});

// Touch controls for player paddle
let isTouching = false;
canvas.addEventListener('touchstart', function (evt) {
  isTouching = true;
  handleTouch(evt);
});
canvas.addEventListener('touchmove', function (evt) {
  if (isTouching) {
    handleTouch(evt);
  }
});
canvas.addEventListener('touchend', function () {
  isTouching = false;
});

function handleTouch(evt) {
  evt.preventDefault();
  if (evt.touches.length > 0) {
    const rect = canvas.getBoundingClientRect();
    // Scale touch Y to game coordinates
    const scaleY = 500 / rect.height;
    const touchY = (evt.touches[0].clientY - rect.top) * scaleY;
    playerY = touchY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(500 - PADDLE_HEIGHT, playerY));
  }
}

// Main game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();