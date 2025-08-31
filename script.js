const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = spawnFood();
let score = 0;
let highscore = localStorage.getItem("snakeHighscore") || 0;

const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const restartBtn = document.getElementById("restartBtn");

highscoreDisplay.textContent = "Highscore: " + highscore;

let lastTime = 0;
let speed = 7;
let dx = 0, dy = 0;
let moveDelay = 0;
let gameOver = false; // 👈 FLAG baru

// kontrol arah
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT"; dx = -1; dy = 0;
  } else if (e.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP"; dx = 0; dy = -1;
  } else if (e.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT"; dx = 1; dy = 0;
  } else if (e.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN"; dx = 0; dy = 1;
  }
});

// spawn makanan
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

// game loop
function gameLoop(timestamp) {
  if (gameOver) return; // 👈 stop loop kalau game selesai

  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  moveDelay += delta;

  if (moveDelay > 1 / speed) {
    moveDelay = 0;
    update();
  }

  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (!direction) return;

  let snakeX = snake[0].x + dx * box;
  let snakeY = snake[0].y + dy * box;

  // cek makanan
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = "Score: " + score;

    if (score > highscore) {
      highscore = score;
      localStorage.setItem("snakeHighscore", highscore);
      highscoreDisplay.textContent = "Highscore: " + highscore;
    }

    food = spawnFood();
    speed += 0.5;
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // game over
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    gameOver = true; // 👈 tandai game selesai
    alert("💀 Game Over! Skor kamu: " + score);
    return;
  }

  snake.unshift(newHead);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // makanan
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

function collision(head, array) {
  return array.some((segment) => head.x === segment.x && head.y === segment.y);
}

requestAnimationFrame(gameLoop);

restartBtn.addEventListener("click", () => {
  location.reload();
});
