// Detta är mitt försök att fixa till v1 så att det funkar. Datum: 2024-01.

// TODO: Visa kommande tre bitar
// Fixa så att man inte kan gå igenom bitar i sidled
// Fixa så man förlorar när det är fullt

var whichForm = 0;
var upKeyUp = 0;
var pause = false;

var frameCounter = 0;
var arrowLeft = 0;
var arrowRight = 0;
var arrowUp = 0;
var arrowDown = 0;
var spaceDown = false;

class Piece {
  constructor(name, color, x, y, game) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.facingDirection = 0;
    this.color = color;
    this.game = game;
  }

  updateGameBoard(color = this.color) {
    let x = this.x[this.facingDirection];
    let y = this.y[this.facingDirection];

    for (let i = 0; i < 4; i++) {
      this.game.updateBoard(x[i], y[i], color);
    }
  }

  moveLeft() {
    if (!arrowLeft) {
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!this.x[i].some((j) => j == 0)) {
        this.x[i] = this.x[i].map((j) => j - 1);
      }
    }
    arrowLeft = 0;
  }

  moveRight() {
    if (!arrowRight) {
      return;
    }
    for (let i = 0; i < 4; i++) {
      if (!this.x[i].some((j) => j == 9)) {
        this.x[i] = this.x[i].map((j) => j + 1);
      }
    }
    arrowRight = 0;
  }

  moveFast() {
    if (!arrowDown || frameCounter % 2 != 0) {
      return;
    }
    for (let i = 0; i < this.y.length; i++) {
      if (this.y[i][3] != 19) {
        this.y[i] = this.y[i].map((j) => j + 1);
      }
    }
    arrowDown = 0;
  }

  decreaseYCoords() {
    if (frameCounter < 30) {
      return;
    }
    for (let i = 0; i < this.y.length; i++) {
      if (this.y[i][3] != 19) {
        this.y[i] = this.y[i].map((j) => j + 1);
      }
    }
    frameCounter = 0;
  }

  placeInstantly() {
    if (!spaceDown) {
      return;
    }
    while (!this.stoppedMoving()) {
      this.y[this.facingDirection] = this.y[this.facingDirection].map(
        (y) => y + 1
      );
    }

    spaceDown = false;
  }

  move() {
    this.updateGameBoard(colors.black);
    this.decreaseYCoords();
    this.moveLeft();
    this.moveRight();
    this.moveFast();
    this.placeInstantly();
    this.updateGameBoard();
  }

  changeFacingDirection() {
    if (arrowUp == 1) {
      arrowUp = 0;
      this.updateGameBoard(colors.black);
      this.facingDirection = (this.facingDirection + 1) % 4;
    }
  }

  stoppedMoving() {
    let x = this.x[this.facingDirection];
    let y = this.y[this.facingDirection];

    if (y.some((y) => y == 19)) {
      return true;
    }

    let ownIds = [];
    for (let i = 0; i < 4; i++) {
      ownIds.push(`r${x[i]}${y[i]}`);
    }

    for (let i = 0; i < 4; i++) {
      let idUnder = `r${x[i]}${y[i] + 1}`;
      if (
        this.game.getColor(x[i], y[i] + 1) != colors.black &&
        !ownIds.includes(idUnder)
      ) {
        return true;
      }
    }
    return false;
  }
}

class Game {
  constructor(width, height) {
    this.activePiece;
    this.width = width;
    this.height = height;
    this.fps = 60;
    this.pieces = [cube, long, sPiece, zPiece, lPiece, lMirror, tPiece];
    this.board = [];
    this.blackArray;
  }

  updateBoard(x, y, color) {
    this.board[y][x] = color;
  }

  getColor(x, y) {
    return this.board[y][x];
  }

  removeFullColumn() {
    for (let i = 0; i < this.height; i++) {
      if (!this.board[i].some((color) => color == colors.black)) {
        this.board = this.board.filter((val, idx) => idx != i);
        this.board.unshift([...this.blackArray]);
      }
    }
  }

  draw() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        document.getElementById(`r${j}${i}`).style.backgroundColor =
          this.board[i][j];
      }
    }
  }

  gameLoop() {
    if (pause) {
      return;
    }
    this.activePiece.changeFacingDirection();
    this.activePiece.move();

    if (this.activePiece.stoppedMoving()) {
      this.removeFullColumn();

      let randomInt = Math.floor(Math.random() * 7);
      let pieceObject = this.pieces[randomInt];
      this.activePiece = new Piece(
        pieceObject.name,
        pieceObject.color,
        [...pieceObject.x],
        [...pieceObject.y],
        this
      );
    }

    this.draw();

    frameCounter++;
  }

  start() {
    // To create the divs
    for (let i = 0; i < this.height; i++) {
      let arr = [];
      for (let j = 0; j < this.width; j++) {
        let div = document.createElement("div");
        div.setAttribute("id", `r${j}${i}`);
        div.setAttribute("class", "ruta");
        div.style.backgroundColor = colors.black;
        document.querySelector(".board").appendChild(div);
        arr.push(colors.black);
      }
      this.board.push(arr);
      this.blackArray = [...arr];
    }

    let randomInt = Math.floor(Math.random() * 7);
    let pieceObject = this.pieces[randomInt];
    this.activePiece = new Piece(
      pieceObject.name,
      pieceObject.color,
      [...pieceObject.x],
      [...pieceObject.y],
      this
    );
    console.log(this.activePiece.name);
    let gameInterval = setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      arrowLeft = 1;
      break;
    case "ArrowRight":
      arrowRight = 1;
      break;
    case "ArrowUp":
      if (upKeyUp == 0) {
        upKeyUp = 1;
        arrowUp = 1;
      }
      break;
    case "ArrowDown":
      arrowDown = 1;
      break;
    case " ":
      spaceDown = true;
      break;
    case "Escape":
      pause = !pause;
      document.getElementById("pause").style.visibility = pause
        ? "visible"
        : "hidden";
      break;
  }
});

window.addEventListener("keyup", (event) => {
  //added this eventListener to fix the continous fire of keyDown
  switch (event.key) {
    case "ArrowUp":
      upKeyUp = 0;
      break;
  }
});

const colors = {
  yellow: "#ffcc00",
  lightBlue: "#33ccff",
  green: "green",
  red: "#e60000",
  orange: "#ff6600",
  darkBlue: "#0052cc",
  purple: "#6600ff",
  black: "#0C0D0E",
};

const cube = {
  x: [
    [4, 5, 4, 5],
    [4, 5, 4, 5],
    [4, 5, 4, 5],
    [4, 5, 4, 5],
  ],
  y: [
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
  ],
  name: "cube",
  color: colors.yellow,
};
const long = {
  x: [
    [3, 4, 5, 6],
    [5, 5, 5, 5],
    [3, 4, 5, 6],
    [4, 4, 4, 4],
  ],
  y: [
    [1, 1, 1, 1],
    [0, 1, 2, 3],
    [2, 2, 2, 2],
    [0, 1, 2, 3],
  ],
  name: "long",
  color: colors.lightBlue,
};
const sPiece = {
  x: [
    [4, 5, 3, 4],
    [4, 4, 5, 5],
    [4, 5, 3, 4],
    [3, 3, 4, 4],
  ],
  y: [
    [0, 0, 1, 1],
    [0, 1, 1, 2],
    [1, 1, 2, 2],
    [0, 1, 1, 2],
  ],
  name: "sPiece",
  color: colors.green,
};
const zPiece = {
  x: [
    [3, 4, 4, 5],
    [5, 5, 4, 4],
    [3, 4, 4, 5],
    [4, 4, 3, 3],
  ],
  y: [
    [0, 0, 1, 1],
    [0, 1, 1, 2],
    [1, 1, 2, 2],
    [0, 1, 1, 2],
  ],
  name: "zPiece",
  color: colors.red,
};
const lPiece = {
  x: [
    [5, 3, 4, 5],
    [4, 4, 4, 5],
    [3, 4, 5, 3],
    [3, 4, 4, 4],
  ],
  y: [
    [0, 1, 1, 1],
    [0, 1, 2, 2],
    [1, 1, 1, 2],
    [0, 0, 1, 2],
  ],
  name: "lPiece",
  color: colors.orange,
};
const lMirror = {
  x: [
    [3, 3, 4, 5],
    [4, 5, 4, 4],
    [3, 4, 5, 5],
    [4, 4, 4, 3],
  ],
  y: [
    [0, 1, 1, 1],
    [0, 0, 1, 2],
    [1, 1, 1, 2],
    [0, 1, 2, 2],
  ],
  name: "lMirror",
  color: colors.darkBlue,
};
const tPiece = {
  x: [
    [4, 3, 4, 5],
    [4, 4, 5, 4],
    [3, 4, 5, 4],
    [4, 3, 4, 4],
  ],
  y: [
    [0, 1, 1, 1],
    [0, 1, 1, 2],
    [1, 1, 1, 2],
    [0, 1, 1, 2],
  ],
  name: "tPiece",
  color: colors.purple,
};

const game = new Game(10, 20);
game.start();
