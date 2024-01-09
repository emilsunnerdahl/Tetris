// This is my second version of tetris that I worked on later in 2020.

// To create the divs
for (let i = 20; i > 0; i--) {
  for (let j = 1; j < 11; j++) {
    let div = document.createElement("div");
    div.setAttribute("id", `r${j}${i}`);
    div.setAttribute("class", "ruta");
    document.querySelector(".board").appendChild(div);
  }
}

let pieces = [
  {
    piece: "cube",
    color: "#ffcc00", // gul
    xAxis: [
      [5, 6, 5, 6],
      [5, 6, 5, 6],
      [5, 6, 5, 6],
      [5, 6, 5, 6],
    ],
    yAxis: [
      [20, 20, 19, 19],
      [20, 20, 19, 19],
      [20, 20, 19, 19],
      [20, 20, 19, 19],
    ],
  },
  {
    piece: "long",
    color: "#33ccff", // ljusblå
    xAxis: [
      [4, 5, 6, 7],
      [6, 6, 6, 6],
      [4, 5, 6, 7],
      [5, 5, 5, 5],
    ],
    yAxis: [
      [19, 19, 19, 19],
      [20, 19, 18, 17],
      [19, 19, 19, 19],
      [20, 19, 18, 17],
    ],
  },
  {
    piece: "sPiece",
    color: "green", // grön
    xAxis: [
      [5, 6, 4, 5],
      [5, 5, 6, 6],
      [5, 6, 4, 5],
      [4, 4, 5, 5],
    ],
    yAxis: [
      [20, 20, 19, 19],
      [20, 19, 19, 18],
      [19, 19, 18, 18],
      [20, 19, 19, 18],
    ],
  },
  {
    piece: "zPiece",
    color: "#e60000", // röd
    xAxis: [
      [4, 5, 5, 6],
      [6, 6, 5, 5],
      [4, 5, 5, 6],
      [5, 5, 4, 4],
    ],
    yAxis: [
      [20, 20, 19, 19],
      [20, 19, 19, 18],
      [19, 19, 18, 18],
      [20, 19, 19, 18],
    ],
  },
  {
    piece: "lPiece",
    color: "#ff6600", // orange
    xAxis: [
      [6, 4, 5, 6],
      [5, 5, 5, 6],
      [4, 5, 6, 4],
      [4, 5, 5, 5],
    ],
    yAxis: [
      [20, 19, 19, 19],
      [20, 19, 18, 18],
      [19, 19, 19, 18],
      [20, 20, 19, 18],
    ],
  },
  {
    piece: "backwardsL",
    color: "#0052cc", // mörkblå
    xAxis: [
      [4, 4, 5, 6],
      [5, 6, 5, 5],
      [4, 5, 6, 6],
      [5, 5, 5, 4],
    ],
    yAxis: [
      [20, 19, 19, 19],
      [20, 20, 19, 18],
      [19, 19, 19, 18],
      [20, 19, 18, 18],
    ],
  },
  {
    piece: "tPiece",
    color: "#6600ff", // lila
    xAxis: [
      [5, 4, 5, 6],
      [5, 5, 6, 5],
      [4, 5, 6, 5],
      [5, 4, 5, 5],
    ],
    yAxis: [
      [20, 19, 19, 19],
      [20, 19, 19, 18],
      [19, 19, 19, 18],
      [20, 19, 19, 18],
    ],
  },
];

function decreaseYAxis(yAxis) {
  for (let i = 0; i < 4; i++) {
    if (yAxis[i][3] !== 1) {
      for (let j = 0; j < 4; j++) {
        yAxis[i][j]--;
      }
    }
  }
  return yAxis;
}

function bgColor(xAxis, yAxis, color, whichForm) {
  for (let i = 0; i < 4; i++) {
    document.querySelector(
      `#r${xAxis[whichForm][i]}${yAxis[whichForm][i]}`
    ).style.backgroundColor = color;
  }
}

function main() {
  let xAxis = pieces[0].xAxis.map((item) => item.slice());
  let yAxis = pieces[0].yAxis.map((item) => item.slice());
  let moveDownInt = 200;
  let moveDownInterval = window.setInterval(
    () => moveDown(xAxis, yAxis),
    moveDownInt
  );
}

function moveDown(xAxis, yAxis) {
  let color = pieces[0].color;
  let defaultColor = "#0C0D0E";
  let whichForm = 0;
  console.log(yAxis[whichForm]);

  if (yAxis[whichForm][3] == 1) {
    yAxis = pieces[0].yAxis.map((item) => item.slice());
  }

  bgColor(xAxis, yAxis, color, whichForm);
  bgColor(xAxis, yAxis, defaultColor, whichForm);
  yAxis = decreaseYAxis(yAxis);
  bgColor(xAxis, yAxis, color, whichForm);
}

let pauseCounter = 0;
let pause = 0;
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      break;
    case "ArrowRight":
      break;
    case "ArrowUp":
      break;
    case "ArrowDown":
      break;
    case " ": //spacebar är bara ett space, altså ' '
      break;
    case "Escape":
      if (pauseCounter == 0) {
        pauseCounter++;
        pause = 1;
        document.getElementById("pause").style.visibility = "visible";
      } else {
        pauseCounter = 0;
        pause = 0;
        document.getElementById("pause").style.visibility = "hidden";
      }
      break;
  }
});

main();
