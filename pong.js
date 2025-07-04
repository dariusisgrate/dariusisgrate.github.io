const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 30;
const AI_X = canvas.width - 30 - PADDLE_WIDTH;
const PADDLE_SPEED = 8;
const BALL_SPEED = 6;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = (canvas.width - BALL_SIZE) / 2;
let ballY = (canvas.height - BALL_SIZE) / 2;
let ballVX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color = "#fff") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = "#fff") {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function resetBall() {
  ballX = (canvas.width - BALL_SIZE) / 2;
  ballY = (canvas.height - BALL_SIZE) / 2;
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
  if (ballY + BALL_SIZE >= canvas.height) {
    ballY = canvas.height - BALL_SIZE;
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
  if (ballX < 0 || ballX > canvas.width) {
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
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function render() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0ff");
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#f00");

  // Draw ball
  drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, "#fff");
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function (evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();