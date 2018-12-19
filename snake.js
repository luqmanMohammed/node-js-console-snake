const readLine = require("readline");
readLine.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const X = 200;
const Y = 45;
let score = 0;
let lstCMD = "left";
let mainGame = [];

if (X > 200 || X < 10 || Y > 45 || Y < 10) {
  console.clear();

  console.log("Invalid Game Size parameter (200 >= X >= 10 )(45 >= Y >= 10 )");
  process.exit();
}

const pRangeX = X - 4;
const pRangeY = Y - 2;

// create game -start-
for (let a = 0; a < Y; a++) {
  const rowArr = [];
  for (let b = 0; b < X; b++) {
    rowArr.push(" ");
  }
  mainGame.push(rowArr);
}
for (let b = 0; b < X; b++) {
  mainGame[0][b] = "#";
  mainGame[Y - 1][b] = "#";
}
for (let c = 0; c < Y; c++) {
  mainGame[c][0] = "#";
  mainGame[c][1] = "#";
  mainGame[c][X - 1] = "#";
  mainGame[c][X - 2] = "#";
}
//create game -end-
let pX = 0,
  pY = 0,
  count = 0;
const putFood = () => {
  const tempGame = mainGame;
  do {
    count++;
    pX = Math.round(Math.random() * pRangeX) + 2;
    pY = Math.round(Math.random() * pRangeY) + 2;
    flag =
      tempGame !== undefined &&
      tempGame[pY] !== undefined &&
      tempGame[pY][pX] !== " ";
  } while (flag);
  tempGame[pY][pX] = "o";
  mainGame = tempGame;
};
putFood();

process.stdin.on("keypress", (str, { name, ctrl }) => {
  if (ctrl && name === "c") process.exit();
  if (name === "right" && lstCMD !== "left") lstCMD = name;
  else if (name === "left" && lstCMD !== "right") lstCMD = name;
  else if (name === "up" && lstCMD !== "down") lstCMD = name;
  else if (name === "down" && lstCMD !== "up") lstCMD = name;
});

const startX = parseInt(X / 2);
const startY = parseInt(Y / 2);
if (mainGame[startY][startX] !== " " && mainGame[startY][startX + 1] !== " ") {
  console.clear();
  console.log("Placement Error. Retry");
  process.exit();
}

let snake = [[startX, startY], [startX + 1, startY]];

const addSnakeNodeAtLast = () => {
  const tempSnake = snake;
  let [snakeTailX, snakeTailY] = tempSnake[tempSnake.length - 1];
  if (mainGame[snakeTailY + 1][snakeTailX] === " ")
    tempSnake.push([snakeTailX, snakeTailY]);
  else if (mainGame[snakeTailY - 1][snakeTailX] === " ")
    tempSnake.push([snakeTailX, snakeTailY]);
  else if (mainGame[snakeTailY][snakeTailX + 1] === " ")
    tempSnake.push([snakeTailX, snakeTailY]);
  else if (mainGame[snakeTailY][snakeTailX - 1] === " ")
    tempSnake.push([snakeTailX, snakeTailY]);

  snake = tempSnake;
};

const drawSnake = () => {
  const [hsnakeX, hsnakeY] = snake[0];
  const tempGame = mainGame;
  tempGame[hsnakeY][hsnakeX] = "@";
  for (let a = 1; a < snake.length; a++) {
    const [snakeY, snakeX] = snake[a];
    tempGame[snakeX][snakeY] = "*";
  }
  mainGame = tempGame;
};

const interpretCommand = cmd => {
  let [snakeHeadX, snakeHeadY] = snake[0];
  switch (cmd) {
    case "left":
      moveSnake(--snakeHeadX, snakeHeadY);
      break;
    case "right":
      moveSnake(++snakeHeadX, snakeHeadY);
      break;
    case "up":
      moveSnake(snakeHeadX, --snakeHeadY);
      break;
    case "down":
      moveSnake(snakeHeadX, ++snakeHeadY);
      break;
  }
};
const moveSnake = (movX, movY) => {
  if (mainGame[movY][movX] === "o") {
    addSnakeNodeAtLast();
    putFood();
    score += 10;
  } else if (mainGame[movY][movX] !== " ") {
    console.log(mainGame[movY][movX]);
    console.log("u hit something");
    process.exit();
  }
  const tempSnake = snake;
  const tempGame = mainGame;
  tempSnake.unshift([movX, movY]);
  const [clearX, clearY] = tempSnake.pop();
  tempGame[clearY][clearX] = " ";
  snake = tempSnake;
  mainGame = tempGame;
};

setInterval(() => {
  interpretCommand(lstCMD);
  console.clear();
  printGame();
}, 80);

const printGame = () => {
  drawSnake();
  let mainGameStr = "";
  for (let a = 0; a < Y; a++) {
    let rowStr = mainGame[a].join("");
    mainGameStr += "\n" + rowStr;
  }
  console.log(mainGameStr);
  console.log(score);
  console.log(lstCMD);
};
