// Detta är mitt försök att fixa till v1 så att det funkar. Datum: 2024-01.

// TODO: Fixa så att man inte kan gå igenom bitar i sidled
// TODO: Fixa så man förlorar när det är fullt

var pause = false;
var frameCounter = 0;
var arrowLeft = false;
var arrowRight = false;
var arrowUp = false;
var arrowUpBlocker = false;
var arrowDown = false;
var spaceDown = false;

class Piece {
  constructor(name, color, xDirections, yDirections, game, offset) {
    this.name = name;
    this.facingDirection = 0;
    this.xDirections = xDirections;
    this.yDirections = yDirections;
    this.x;
    this.y;
    this.ids;
    this.color = color;
    this.game = game;
    this.offset = offset;
    this.xRightOffset = Math.max(...this.xDirections[0]);

    this.updateCoords();
    this.updateIds();
  }

  updateCoords() {
    this.x = [...this.xDirections[this.facingDirection]];
    this.x = this.x.map((x) => x + this.offset[0]);
    this.y = [...this.yDirections[this.facingDirection]];
    this.y = this.y.map((y) => y + this.offset[1]);
  }

  updateGameBoard(color = this.color) {
    for (let i = 0; i < 4; i++) {
      this.game.updateBoard(this.x[i], this.y[i], color);
    }
  }

  updateIds() {
    this.ids = [];
    for (let i = 0; i < 4; i++) {
      this.ids.push(`${this.x[i]}${this.y[i]}`);
    }
  }

  checkForCollision(offset) {
    this.updateIds();
    return [0, 1, 2, 3].some(
      (i) =>
        this.game.getColor(this.x[i] + offset[0], this.y[i] + offset[1]) !=
          colors.black &&
        !this.ids.includes(`${this.x[i] + offset[0]}${this.y[i] + offset[1]}`)
    );
  }

  moveLeft() {
    if (!arrowLeft) {
      return;
    }
    if (!this.x.some((x) => x == 0) && !this.checkForCollision([-1, 0])) {
      this.x = this.x.map((x) => x - 1);
    }
    if (this.offset[0] != 0) {
      this.offset[0] = this.offset[0] - 1;
    }
    arrowLeft = false;
  }

  moveRight() {
    if (!arrowRight) {
      return;
    }
    if (!this.x.some((x) => x == 9) && !this.checkForCollision([1, 0])) {
      this.x = this.x.map((x) => x + 1);
    }
    if (this.offset[0] + this.xRightOffset != 9) {
      this.offset[0] = this.offset[0] + 1;
    }
    arrowRight = false;
  }

  moveFast() {
    if (!arrowDown || frameCounter % 2 != 0) {
      return;
    }

    if (this.y[3] != 19) {
      this.y = this.y.map((y) => y + 1);
    }
    if (
      !this.yDirections.some((arr) => arr.some((y) => y + this.offset[1] == 19))
    ) {
      this.offset[1] = this.offset[1] + 1;
    }
    arrowDown = false;
  }

  decreaseYCoords() {
    if (frameCounter < 30) {
      return;
    }
    if (this.y[3] != 19) {
      this.y = this.y.map((y) => y + 1);
    }
    if (
      !this.yDirections.some((arr) => arr.some((y) => y + this.offset[1] == 19))
    ) {
      this.offset[1] = this.offset[1] + 1;
    }
    frameCounter = 0;
  }

  placeInstantly() {
    if (!spaceDown) {
      return;
    }
    while (!this.stoppedMoving()) {
      this.y = this.y.map((y) => y + 1);
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
    if (arrowUp) {
      arrowUp = false;
      this.updateGameBoard(colors.black);
      this.facingDirection =
        (this.facingDirection + 1) % this.xDirections.length;
      this.updateCoords();
    }
  }

  stoppedMoving() {
    return this.y[3] == 19 || this.checkForCollision([0, 1]);
  }

  isGameOver() {
    return [0, 1, 2, 3].some(
      (i) => this.game.getColor(this.x[i], this.y[i]) != colors.black
    );
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
    this.nextPieces = [];
    this.gameOver = false;
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

  createBoardDivs() {
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
  }

  createNextPiecesDivs() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 4; j++) {
        let div = document.createElement("div");
        div.setAttribute("id", `n-${j}${i}`);
        div.setAttribute("class", "nextPieceSquare");
        document.querySelector(".nextPieces").appendChild(div);
      }
    }
  }

  createNextPieces() {
    let randomInt;
    let pieceObject;

    for (let i = 0; i < 3; i++) {
      randomInt = Math.floor(Math.random() * 7);
      pieceObject = this.pieces[randomInt];
      this.nextPieces.push(pieceObject);
    }
  }

  createNewPiece() {
    let randomInt = Math.floor(Math.random() * 7);
    let pieceObject = this.pieces[randomInt];
    this.nextPieces.push(pieceObject);

    let nextPiece = this.nextPieces.shift();
    this.activePiece = new Piece(
      nextPiece.name,
      nextPiece.color,
      [...nextPiece.x],
      [...nextPiece.y],
      this,
      [...nextPiece.offset]
    );
  }

  draw() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        document.getElementById(`r${j}${i}`).style.backgroundColor =
          this.board[i][j];
      }
    }
  }

  drawNextPieces() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 4; j++) {
        document.getElementById(`n-${j}${i}`).style.backgroundColor =
          colors.black;
      }
    }

    let nextPieceX;
    let nextPieceY;
    for (let i = 0; i < 3; i++) {
      nextPieceX = this.nextPieces[i].x[0];
      nextPieceY = this.nextPieces[i].y[0];
      for (let j = 0; j < 4; j++) {
        document.getElementById(
          `n-${nextPieceX[j] + this.nextPieces[i].offset[0] - 3}${
            nextPieceY[j] + 3 * i
          }`
        ).style.backgroundColor = this.nextPieces[i].color;
      }
    }
  }

  checkForGameOver() {
    if (this.activePiece.isGameOver()) {
      this.gameOver = true;
      let header = document.getElementById("pause");
      header.style.visibility = "visible";
      header.textContent = "Game Over";
      this.activePiece.updateGameBoard();
    }
  }

  gameLoop() {
    if (this.gameOver) {
      return;
    }

    if (pause) {
      return;
    }
    this.activePiece.changeFacingDirection();
    this.activePiece.move();

    if (this.activePiece.stoppedMoving()) {
      this.removeFullColumn();
      this.createNewPiece();
      this.drawNextPieces();
      this.checkForGameOver();
    }

    this.draw();
    frameCounter++;
  }

  start() {
    this.createBoardDivs();
    this.createNextPiecesDivs();
    this.createNextPieces();
    this.createNewPiece();
    this.drawNextPieces();
    let gameInterval = setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      arrowLeft = true;
      break;
    case "ArrowRight":
      arrowRight = true;
      break;
    case "ArrowUp":
      if (!arrowUpBlocker) {
        arrowUp = true;
        arrowUpBlocker = true;
      }
      break;
    case "ArrowDown":
      arrowDown = true;
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
  switch (event.key) {
    case "ArrowUp":
      arrowUpBlocker = false;
      break;
  }
});

const colors = {
  yellow: "#ffcc00",
  lightBlue: "#33ccff",
  green: "#019429",
  red: "#e60000",
  orange: "#ff6600",
  darkBlue: "#0052cc",
  purple: "#7c029e",
  black: "#0C0D0E",
  grey: "#484848",
  lightGrey: "#989898",
};

const cube = {
  x: [[0, 1, 0, 1]],
  y: [[0, 0, 1, 1]],
  name: "cube",
  color: colors.yellow,
  offset: [4, 0],
};
const long = {
  x: [
    [0, 1, 2, 3],
    [2, 2, 2, 2],
    [0, 1, 2, 3],
    [1, 1, 1, 1],
  ],
  y: [
    [1, 1, 1, 1],
    [0, 1, 2, 3],
    [2, 2, 2, 2],
    [0, 1, 2, 3],
  ],
  name: "long",
  color: colors.lightBlue,
  offset: [3, 0],
};
const sPiece = {
  x: [
    [1, 2, 0, 1],
    [1, 1, 2, 2],
    [1, 2, 0, 1],
    [0, 0, 1, 1],
  ],
  y: [
    [0, 0, 1, 1],
    [0, 1, 1, 2],
    [1, 1, 2, 2],
    [0, 1, 1, 2],
  ],
  name: "sPiece",
  color: colors.green,
  offset: [3, 0],
};
const zPiece = {
  x: [
    [0, 1, 1, 2],
    [2, 2, 1, 1],
    [0, 1, 1, 2],
    [1, 1, 0, 0],
  ],
  y: [
    [0, 0, 1, 1],
    [0, 1, 1, 2],
    [1, 1, 2, 2],
    [0, 1, 1, 2],
  ],
  name: "zPiece",
  color: colors.red,
  offset: [3, 0],
};
const lPiece = {
  x: [
    [2, 0, 1, 2],
    [1, 1, 1, 2],
    [0, 1, 2, 0],
    [0, 1, 1, 1],
  ],
  y: [
    [0, 1, 1, 1],
    [0, 1, 2, 2],
    [1, 1, 1, 2],
    [0, 0, 1, 2],
  ],
  name: "lPiece",
  color: colors.orange,
  offset: [3, 0],
};
const lMirror = {
  x: [
    [0, 0, 1, 2],
    [1, 2, 1, 1],
    [0, 1, 2, 2],
    [1, 1, 1, 0],
  ],
  y: [
    [0, 1, 1, 1],
    [0, 0, 1, 2],
    [1, 1, 1, 2],
    [0, 1, 2, 2],
  ],
  name: "lMirror",
  color: colors.darkBlue,
  offset: [3, 0],
};
const tPiece = {
  x: [
    [1, 0, 1, 2],
    [1, 1, 2, 1],
    [0, 1, 2, 1],
    [1, 0, 1, 1],
  ],
  y: [
    [0, 1, 1, 1],
    [0, 1, 1, 2],
    [1, 1, 1, 2],
    [0, 1, 1, 2],
  ],
  name: "tPiece",
  color: colors.purple,
  offset: [3, 0],
};

const game = new Game(10, 20);
game.start();
