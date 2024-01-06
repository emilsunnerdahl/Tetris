//INSPEKTA HTML I HEMSIDAN SÅ KAN DU COPY PASTEA FRÅN DÄR I BODY IN TILL VS STUDIO, Sedan behöver du använda lösningen på stack overflow 
//för att splitta upp det i olika rader
// function $(element){ //gör koden snabbare att skriva!
//   return document.getElementById(element);
// }

// function $c(element, color){
//   return document.getElementById(element).style.backgroundColor = (color);
// }

// var namn = { //Ett objekt kan lätt användas för att samla liknande funktioner och variablar på samma ställe. 
//   //Dock om man vill ha flera olika värden på variablerna kan det snabbt bli krångligt att copy pastea objekten om och om igen. Då används classes!
//   xAxis: [1, 2, 3],
//   login: function(){
//     return this.xAxis[0]; //this referrar till objekt, alltså this.xAxis är samma som brickor.xAxis
//   }
// };

var checkCoords = [];
var clrdCoords = [];
var clrdCoordsY = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]; //clrdCoordsY stands for clrdCoordsYAxis :)
var pieceUnder = 0;
var borderPieceUnder = 0;
var randomInt = 0;
var randomInt2 = 0;
var randomInt3 = 0;
var randomInt4 = 0;
var removeInt;
var moveLeft = 0;
var moveRight = 0;
var moveFast = 0;
var blocker = 0; //so you can't change direction or xAxis why moving fast
var moveDownInt = 1000;
var whichForm = 0;
var upKeyUp = 0;
var arrowDown = 0;
var pauseCounter = 0; //pauses
var pause = 0; //there's an if statement around the whole move and decreaseYAxis function that checks this pause so you can paus the game
var arrowUp = 0; //to guarantee that all colored bricks deletes when the form changes
var borderChange = 0;

//The coordinates below are read from top left to top right, the same way we read
var cubeCoords = { //coords = förkortning av coordinates
  btmY: [[2, 2, 1, 1], [2, 2, 1, 1], [2, 2, 1, 1], [2, 2, 1, 1]]
};
var longCoords = {
  btmY: [[1, 1, 1, 1], [4, 3, 2, 1], [1, 1, 1, 1], [4, 3, 2, 1]]
};
var sPieceCoords = {
  btmY: [[2, 2, 1, 1], [3, 2, 2, 1], [2, 2, 1, 1], [3, 2, 2, 1]]
};
var zPieceCoords = {
  btmY: [[2, 2, 1, 1], [3, 2, 2, 1], [2, 2, 1, 1], [3, 2, 2, 1]]
};
var lPieceCoords = {
  btmY: [[2, 1, 1, 1], [3, 2, 1, 1], [2, 2, 2, 1], [3, 3, 2, 1]]
};
var backwardsLCoords = {
  btmY: [[2, 1, 1, 1], [3, 3, 2, 1], [2, 2, 2, 1], [3, 2, 1, 1]]
};
var tPieceCoords = {
  btmY: [[2, 1, 1, 1], [3, 2, 2, 1], [2, 2, 2, 1], [3, 2, 2, 1]]
};

class Pieces{
  constructor(bottomYCoordinates, pieceColor, name){ //Det är constructor funktionen som runnas när jag vill creata ett nytt objekt av Brickor
    //Bara för object properties, methods skrivs under
    
    this.xAxis;
    this.yAxis;
    this.yAxis2;
    this.bottomYCoordinates = bottomYCoordinates;
    this.name = name;

    this.moveTrue = 0;
    this.pieceColor = pieceColor;

    this.coordinatesArray = [[], [], [], []];
    this.bottomCoordinatesArray = [[], [], [], []];
    this.checkCoordinatesArray = [[], [], [], []];

    this.originalCoords();
    this.changeCoordinates(this.coordinatesArray, this.yAxis);
    this.changeCoordinates(this.bottomCoordinatesArray, this.bottomYCoordinates);
    this.changeCoordinates(this.checkCoordinatesArray, this.yAxis2);

    this.moveInterval;
    this.moveBorderInterval;
  }

  originalCoords(){
    switch(this.name){
      case "cube":
        this.xAxis = [[5, 6, 5, 6], [5, 6, 5, 6], [5, 6, 5, 6], [5, 6, 5, 6]];
        this.yAxis = [[20, 20, 19, 19], [20, 20, 19, 19], [20, 20, 19, 19], [20, 20, 19, 19]];
        this.yAxis2 = [[20, 20, 19, 19], [20, 20, 19, 19], [20, 20, 19, 19], [20, 20, 19, 19]];
        this.fastYAxis = [[20, 20, 19, 19], [20, 20, 19, 19], [20, 20, 19, 19], [20, 20, 19, 19]];
        break;
      case "long":
        this.xAxis = [[4, 5, 6, 7], [6, 6, 6, 6], [4, 5, 6, 7], [5, 5, 5, 5]];
        this.yAxis = [[19, 19, 19, 19], [20, 19, 18, 17], [19, 19, 19, 19], [20, 19, 18, 17]];
        this.yAxis2 = [[19, 19, 19, 19], [20, 19, 18, 17], [19, 19, 19, 19], [20, 19, 18, 17]];
        this.fastYAxis = [[19, 19, 19, 19], [20, 19, 18, 17], [19, 19, 19, 19], [20, 19, 18, 17]];
        break;
      case "sPiece":
        this.xAxis = [[5, 6, 4, 5], [5, 5, 6, 6], [5, 6, 4, 5], [4, 4, 5, 5]];
        this.yAxis = [[20, 20, 19, 19], [20, 19, 19, 18], [19, 19, 18, 18], [20, 19, 19, 18]];
        this.yAxis2 = [[20, 20, 19, 19], [20, 19, 19, 18], [19, 19, 18, 18], [20, 19, 19, 18]];
        this.fastYAxis = [[20, 20, 19, 19], [20, 19, 19, 18], [19, 19, 18, 18], [20, 19, 19, 18]];
        break;
      case "zPiece":
        this.xAxis = [[4, 5, 5, 6], [6, 6, 5, 5], [4, 5, 5, 6], [5, 5, 4, 4]];
        this.yAxis = [[20, 20, 19, 19], [20, 19, 19, 18], [19, 19, 18, 18], [20, 19, 19, 18]];
        this.yAxis2 = [[20, 20, 19, 19], [20, 19, 19, 18], [19, 19, 18, 18], [20, 19, 19, 18]];
        this.fastYAxis = [[20, 20, 19, 19], [20, 19, 19, 18], [19, 19, 18, 18], [20, 19, 19, 18]];
        break;
      case "lPiece":
        this.xAxis = [[6, 4, 5, 6], [5, 5, 5, 6], [4, 5, 6, 4], [4, 5, 5, 5]];
        this.yAxis = [[20, 19, 19, 19], [20, 19, 18, 18], [19, 19, 19, 18], [20, 20, 19, 18]];
        this.yAxis2 = [[20, 19, 19, 19], [20, 19, 18, 18], [19, 19, 19, 18], [20, 20, 19, 18]];
        this.fastYAxis = [[20, 19, 19, 19], [20, 19, 18, 18], [19, 19, 19, 18], [20, 20, 19, 18]];
        break;
      case "backwardsL":
        this.xAxis = [[4, 4, 5, 6], [5, 6, 5, 5], [4, 5, 6, 6], [5, 5, 5, 4]];
        this.yAxis = [[20, 19, 19, 19], [20, 20, 19, 18], [19, 19, 19, 18], [20, 19, 18, 18]];
        this.yAxis2 = [[20, 19, 19, 19], [20, 20, 19, 18], [19, 19, 19, 18], [20, 19, 18, 18]];
        this.fastYAxis = [[20, 19, 19, 19], [20, 20, 19, 18], [19, 19, 19, 18], [20, 19, 18, 18]];
        break;
      case "tPiece":
        this.xAxis = [[5, 4, 5, 6], [5, 5, 6, 5], [4, 5, 6, 5], [5, 4, 5, 5]];
        this.yAxis = [[20, 19, 19, 19], [20, 19, 19, 18], [19, 19, 19, 18], [20, 19, 19, 18]];
        this.yAxis2 = [[20, 19, 19, 19], [20, 19, 19, 18], [19, 19, 19, 18], [20, 19, 19, 18]];
        this.fastYAxis = [[20, 19, 19, 19], [20, 19, 19, 18], [19, 19, 19, 18], [20, 19, 19, 18]];
        break;
      default: 
        console.log("mvapmvap");
    }
  }

  color(element, color){
    for(randomInt = 0; randomInt < 4; randomInt++){
      document.getElementById(element[whichForm][randomInt]).style.backgroundColor = (color);
    }
  }

  pushFunction(arrayToPushInto, arrayThatPushes){
    for(randomInt = 0; randomInt < 4; randomInt++){
      arrayToPushInto.push(arrayThatPushes[randomInt]);
    }
  }

  border(element, color){
    for(randomInt = 0; randomInt < 4; randomInt++){
      document.getElementById(element[whichForm][randomInt]).style.border = "1px solid " + (color);
    }
  }

  borderMove(){
    if(pause == 0){

      console.log(this.bottomCoordinatesArray);
      for(randomInt = 0; randomInt < checkCoords.length; randomInt++){
        if(this.bottomCoordinatesArray[whichForm][0] == checkCoords[randomInt] || this.bottomCoordinatesArray[whichForm][1] == checkCoords[randomInt] || this.bottomCoordinatesArray[whichForm][2] == checkCoords[randomInt] || this.bottomCoordinatesArray[whichForm][3] == checkCoords[randomInt]){
          console.log("yes");
        }
      }
      for(randomInt = 0; randomInt < 4; randomInt++){
        if(this.fastYAxis[randomInt][3] !== 1){
          for(randomInt2 = 0; randomInt2 < 4; randomInt2++){
            this.fastYAxis[randomInt][randomInt2]--;
          }
        }
      }
      this.changeCoordinates(this.bottomCoordinatesArray, this.fastYAxis);
      
      if(this.fastYAxis[whichForm][3] == 1){
        borderPieceUnder = 0;
        this.border(this.bottomCoordinatesArray, this.pieceColor);
      }
    }
  }

  decreaseYAxis(){
    if(this.moveTrue == 1 && pause == 0 && moveFast == 0){
      for(randomInt = 0; randomInt < 4; randomInt++){
        if(this.yAxis[randomInt][3] !== 1){
          for(randomInt2 = 0; randomInt2 < 4; randomInt2++){
            this.yAxis[randomInt][randomInt2]--;
            this.yAxis2[randomInt][randomInt2]--;
          }
        }
      }
    }
  }
  
  changeCoordinates(arrayAxis, yAxis){
    for(randomInt = 0; randomInt < 4; randomInt++){
      for(randomInt2 = 0; randomInt2 < 4; randomInt2++){
        arrayAxis[randomInt][randomInt2] = "" + yAxis[randomInt][randomInt2] + this.xAxis[randomInt][randomInt2];
      }
    }
  }

  move(){
    if(pause == 0){
      if(arrowUp == 1 && blocker == 0){
        arrowUp = 0;
        this.color(this.coordinatesArray, "#0C0D0E");
        // this.border(this.bottomCoordinatesArray, "#484848");
        if(whichForm == 3){
          whichForm = 0;
        }
        else{
          whichForm++;
        }
      }
      if(arrowDown == 1){
        arrowDown = 0;
        // clearInterval(moveYInterval);
        // moveDownInt = 50;
        // moveYInterval = setInterval(function(){ this.decreaseYAxis(); }, moveDownInt); 
        this.decreaseYAxis();
      }

      if(moveLeft == 1 && blocker == 0){
        moveLeft = 0;
        for(randomInt = 0; randomInt < 4; randomInt++){
          if(this.xAxis[randomInt][0] !== 1 && this.xAxis[randomInt][1] !== 1 && this.xAxis[randomInt][2] !== 1 && this.xAxis[randomInt][3] !==1){  
            for(randomInt2 = 0; randomInt2 < 4; randomInt2++){
              this.xAxis[randomInt][randomInt2]--;
            }
          }
        }
      }

      if(moveRight == 1 && blocker == 0){
        moveRight = 0;
        for(randomInt = 0; randomInt < 4; randomInt++){  
          if(this.xAxis[randomInt][0] !== 10 && this.xAxis[randomInt][1] !== 10 && this.xAxis[randomInt][2] !== 10 && this.xAxis[randomInt][3] !==10){
            for(randomInt2 = 0; randomInt2 < 4; randomInt2++){
              this.xAxis[randomInt][randomInt2]++;
            }
          }
        }
      }

      if(moveFast == 1){
        for(randomInt = 0; randomInt < 4; randomInt++){
          if(this.yAxis2[randomInt][3] !== 1){
            for(randomInt2 = 0; randomInt2 < 4; randomInt2++){
              this.yAxis2[randomInt][randomInt2]--;
            }
          }
        }
      }

      // this.border(this.bottomCoordinatesArray, "#484848");
      this.changeCoordinates(this.checkCoordinatesArray, this.yAxis2);
      // this.changeCoordinates(this.bottomCoordinatesArray, this.bottomYCoordinates);
      // this.border(this.bottomCoordinatesArray, this.pieceColor);
  
      for(randomInt = 0; randomInt < checkCoords.length; randomInt++){
        if(this.checkCoordinatesArray[whichForm][0] == checkCoords[randomInt] || this.checkCoordinatesArray[whichForm][1] == checkCoords[randomInt] || this.checkCoordinatesArray[whichForm][2] == checkCoords[randomInt] || this.checkCoordinatesArray[whichForm][3] == checkCoords[randomInt]){
          pieceUnder = 1;
        }
      }
      
      if(pieceUnder == 0){
        if(moveFast == 1){
          for(randomInt3 = 0; randomInt3 < 4; randomInt3++){
            if(this.yAxis[randomInt3][3] !== 1){
              for(randomInt4 = 0; randomInt4 < 4; randomInt4++){
                this.yAxis[randomInt3][randomInt4]--;
              }
            }
          }
        }
  
        if(this.moveTrue == 1){
          this.color(this.coordinatesArray, "#0C0D0E");
        }
        
        this.changeCoordinates(this.coordinatesArray, this.yAxis);
        this.color(this.coordinatesArray, this.pieceColor);
      }
      
      this.moveTrue = 1;
      if(borderChange == 1){
        borderChange = 0;
        this.border(this.bottomCoordinatesArray, "#484848");
      }
      
      if(this.yAxis[whichForm][3] == 1 || pieceUnder == 1){
        pieceUnder = 0;
        this.moveTrue = 0;
        moveFast = 0;
        blocker = 0;
        this.border(this.bottomCoordinatesArray, "#484848");
        clearInterval(moveYInterval);
        clearInterval(moveInterval);
        clearInterval(moveBorderInterval);
        
        this.pushFunction(checkCoords, this.coordinatesArray[whichForm]);
        this.pushFunction(clrdCoords, this.yAxis[whichForm]);

        // for(randomInt = 0; randomInt < 4; randomInt++){
        //   clrdCoordsY[this.yAxis[whichForm][randomInt]-1].push(this.yAxis[whichForm][randomInt]);
        // }

        // for(randomInt = 0; randomInt < 20; randomInt++){
        //   if(clrdCoordsY[randomInt].length >= 10){
        //     removeInt = clrdCoordsY[randomInt][0];
        //     for(randomInt2 = clrdCoords.length; randomInt2 >= 0; randomInt2--){
        //       if(clrdCoords[randomInt2] == removeInt){
        //         document.getElementById(checkCoords[randomInt2]).style.backgroundColor = ("#0C0D0E");
        //         clrdCoords.splice(randomInt2, 1);
        //         checkCoords.splice(randomInt2, 1);
        //       }
        //     }
        //     clrdCoordsY.splice(randomInt, 1);
        //     this.rowFilled();
        //     if(clrdCoordsY.length < 20){
        //       clrdCoordsY.push([]);
        //     }

        //     break;
        //   }
        // }

        // var testArray = []; kanske kan searchea igenom alla rutor och lägga in färgerna
        // for(var i = 20; i>0 ;i--){
        //   for (var j=1;j<11;j++){
        //     if(document.getElementById("" + i + j).style.backgroundColor == ("#0C0D0E")){
        //       // console.log("" + i + j);
        //       console.log(document.getElementById("" + i + j).style.backgroundColor);
        //     }
        //   }
        // }

        this.originalCoords();
        this.changeCoordinates(this.coordinatesArray, this.yAxis);
        // console.log(clrdCoords);
        // console.log(checkCoords);
        whichPiece();
        whichForm = 0; //needs to be after the pushfunction!
        }

      return this; //returna this för att man ska kunna köra method chaining.
    }
  }
//   rowFilled(){
//     var whichColor = [];
//     for(var x = 0; x < checkCoords.length; x++){
//       if(clrdCoords[x] > removeInt){
//         whichColor.push(document.getElementById(checkCoords[x]).style.backgroundColor);
//         document.getElementById(checkCoords[x]).style.backgroundColor = ("#0C0D0E");
//       }
//     }
//     for(var x = 0; x < checkCoords.length; x++){
//       if(clrdCoords[x] > removeInt){
//         checkCoords[x] = checkCoords[x].replace(clrdCoords[x], clrdCoords[x] - 1);
//         document.getElementById(checkCoords[x]).style.backgroundColor = (whichColor[x]);
//       }
//     }

//     for(randomInt3 = randomInt; randomInt3 < clrdCoordsY.length; randomInt3++){
//       for(randomInt4 = 0; randomInt4 < clrdCoordsY[randomInt3].length; randomInt4++){
//         clrdCoordsY[randomInt3][randomInt4] = clrdCoordsY[randomInt3][randomInt4] - 1;
//       }
//     }

//     for(var x = 0; x < clrdCoords.length; x++){
//       clrdCoords[x] = clrdCoords[x] - 1;
//     }

//     whichColor = [];
//   }
} 

function whichPiece(){
  switch(Math.floor(Math.random() * 7)){
    case 0:
      moveInterval = setInterval(function(){ cube.move(); }, 17); //1000ms = 1 s, 1000ms/60fps = 17
      moveBorderInterval = setInterval(function(){ cube.borderMove(); }, 1);
      moveYInterval = setInterval(function(){ cube.decreaseYAxis(); }, moveDownInt); 
      break;
    case 1:
      moveInterval = setInterval(function(){ long.move(); }, 17);
      moveBorderInterval = setInterval(function(){ long.borderMove(); }, 1);
      moveYInterval = setInterval(function(){ long.decreaseYAxis(); }, moveDownInt); 
      break;
    case 2:
      moveInterval = setInterval(function(){ sPiece.move(); }, 17);
      moveBorderInterval = setInterval(function(){ sPiece.borderMove(); }, 1);
      moveYInterval = setInterval(function(){ sPiece.decreaseYAxis(); }, moveDownInt); 
      break;
    case 3:
      moveInterval = setInterval(function(){ lPiece.move(); }, 17);
      moveBorderInterval = setInterval(function(){ lPiece.borderMove(); }, 1);
      moveYInterval = setInterval(function(){ lPiece.decreaseYAxis(); }, moveDownInt); 
      break;
    case 4:
      moveInterval = setInterval(function(){ zPiece.move(); }, 17);
      moveBorderInterval = setInterval(function(){ zPiece.borderMove(); }, 1);
      moveYInterval = setInterval(function(){ zPiece.decreaseYAxis(); }, moveDownInt); 
      break;
    case 5:
      moveInterval = setInterval(function(){ tPiece.move(); }, 17);
      moveBorderInterval = setInterval(function(){ tPiece.borderMove(); }, 1);
      moveYInterval = setInterval(function(){ tPiece.decreaseYAxis(); }, moveDownInt); 
      break;
    case 6:
      moveInterval = setInterval(function(){ backwardsL.move(); }, 17);
      moveBorderInterval = setInterval(function(){ backwardsL.borderMove(); }, 1);
      moveYInterval = setInterval(function(){ backwardsL.decreaseYAxis(); }, moveDownInt); 
      break;
  }
}
// [[20, 20, 19, 19], [20, 20, 19, 19], [20, 20, 19, 19], [20, 20, 19, 19]]
var cube = new Pieces(cubeCoords.btmY, "#ffcc00", "cube") //gul
var long = new Pieces(longCoords.btmY, "#33ccff", "long") //ljusblå
var sPiece = new Pieces(sPieceCoords.btmY, "green", "sPiece")
var zPiece = new Pieces(zPieceCoords.btmY, "#e60000", "zPiece") //red
var lPiece = new Pieces(lPieceCoords.btmY, "#ff6600", "lPiece") //orange
var backwardsL = new Pieces(backwardsLCoords.btmY, "#0052cc", "backwardsL") //mörkblå
var tPiece = new Pieces(tPieceCoords.btmY, "#6600ff", "tPiece") //purple
//cube.move() //här måste cube.move ha värdet cube för att nästa .move ska vara cube.move. Därför kör return this.
//var moveInterval = setInterval(function(){ tBricka.move(); }, 1000);
whichPiece();

//var kub = new Pieces() Detta kommer skapa ett nytt objekt som heter kub med hjälp av classen Pieces
//Vad new gör:
//  - creates a new empty object{}
//  - sets the value of "this" to be the new empty object
//  - calls the constructor method

window.addEventListener('keydown', (event) => {
  switch (event.key){
    case 'ArrowLeft':
      borderChange = 1;
      moveLeft = 1;
      break;
    case 'ArrowRight':
      borderChange = 1;
      moveRight = 1;
      break;
    case 'ArrowUp':
      borderChange = 1;
      if(upKeyUp == 0){
        upKeyUp = 1;
        arrowUp = 1;
      }
      break;
    case 'ArrowDown':
      borderChange = 1;
      arrowDown = 1;
      break;
    case ' ': //spacebar är bara ett space, altså ' '
      borderChange = 1;
      clearInterval(moveYInterval);
      moveFast = 1;
      blocker = 1;
      break;
    case 'Escape':
      if(pauseCounter == 0){
        pauseCounter++;
        pause = 1;
        document.getElementById("pause").style.visibility = "visible";
      }
      else{
        pauseCounter = 0;
        pause = 0;
        document.getElementById("pause").style.visibility = "hidden";
      }
      break;
  }
});

window.addEventListener('keyup', (event) => { //added this eventListener to fix the continous fire of keyDown
  switch (event.key){
    case 'ArrowUp':
      upKeyUp = 0;
      break;
  }
});