let canvas = document.getElementById("mazecanvas");
let context = canvas.getContext("2d");
let currRectX = 425;
let currRectY = 3;
let mazeWidth = 600;
let mazeHeight = 600;
let intervalVar = setInterval(drawMazeAndRectangle,1000/60);
let levelMaze = "https://cors-anywhere.herokuapp.com/https://i.imgur.com/cV3rqJT.png"
let level1Maze = "https://cors-anywhere.herokuapp.com/https://i.imgur.com/cV3rqJT.png"
let level2Maze = "https://cors-anywhere.herokuapp.com/https://i.imgur.com/upYI237.png"
let levelnum = document.getElementById("levelnum")


function getScores(){
  return fetch('http://localhost:3000/api/v1/scores')
    .then(function (response) {return response.json() })
    .then(function (scores) {
      let tablebody = document.getElementById("tbody")
      tablebody.innerText = ""
      scores.forEach(function (score){
        let level = levelnum.innerText
        let scoreTr = document.createElement("tr")
        let nameTd = document.createElement("td")
        let scoreTd = document.createElement("td")
        if (level === `${score.level}`) {
          tablebody.appendChild(scoreTr)
          nameTd.innerText = `${score.player}`
          scoreTd.innerText = `${score.score}`
          scoreTr.appendChild(nameTd)
          scoreTr.appendChild(scoreTd)
        }
      })
      sortTable()
    })
}
getScores()

// Sort Table
let getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
let comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

function sortTable() {
    let tablebody = document.getElementById("tbody")
    let th = document.getElementById("tabletime")
    Array.from(tablebody.querySelectorAll('tr:nth-child(n+1)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), !this.asc))
        .forEach(tr => tablebody.appendChild(tr) );
};


//making a second layer
let imgCanvas = document.getElementById("imgcanvas");
let imgContext = imgCanvas.getContext("2d");

//making a game piece square 
let squareHeight = 7;
let squareWidth = 7;
let squareX = " "; //initial position cleared for new mazes
let squareY = " ";

// score/timer
let scoreNum = 0
let scoreCounter = document.getElementById("score")
let hax = 0 //cheat detection

//startbutton
let startButton = document.getElementById("startbutton")
let startModal = document.getElementById("startGame")

// warnings
let wallWarning = document.getElementById("warn")
let wallBreak = document.getElementById("wallbreak")
let alerts = document.getElementById("alerts")

//draws gameplay avatar/game piece/ etc
function drawPaddle() { 
  context.beginPath();
  context.rect(squareX, squareY, squareWidth, squareHeight); //first two are position, second two is x/y size
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
}

//creating score counter
let scoreHolder = document.createElement("div")
scoreCounter.appendChild(scoreHolder)

//sound!
let bees = new Audio(`assets/Beesshort.mp3`)
bees.volume = .6
let hit = new Audio(`assets/quakehit.wav`)
let win = new Audio(`assets/win31.mp3`)
let theme = new Audio(`assets/moontheme.mp3`)
theme.volume = .25

function drawMazeAndRectangle(rectX, rectY) { //original maze and player piece
    let mazeImg = new Image();
    mazeImg.onload = function (){ 
        context.drawImage(mazeImg, 0, 0);
    }
    scoreNum += 1
    scoreHolder.innerText = `Seconds: ${(scoreNum/60).toFixed(2)}` //updates our score here. currently in seconds. (stretch goal, countdown time meter?)
    mazeImg.crossOrigin = "Anonymous";
    mazeImg.src = levelMaze
    drawPaddle()
}

function makeWhite(x, y, w, h) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fillStyle = "white";
    context.fill();
}

function drawImage(){ //second layer code
  let mazeImg = new Image();
    mazeImg.onload = function () {
        makeWhite(0, 0, canvas.width, canvas.height)
        imgContext.drawImage(mazeImg, 0, 0);
    };
        mazeImg.crossOrigin = "Anonymous";
        mazeImg.src = levelMaze
}


// can move code

function canMoveTo(squareX, squareY) {
  let imgData = context.getImageData(squareX, squareY, squareWidth, squareHeight);
  let data = imgData.data;
  let canMove = 1; // 1 means: the rectangle can move
  if (squareX >= 0 && squareX <= mazeWidth - 15 && squareY >= 0 && squareY <= mazeHeight - 15) { // check whether the rectangle would move inside the bounds of the canvas
      for (var i = 0; i < 4 * 7 * 7; i += 4) { // look at all pixels
          if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) { // black
              canMove = 0; // 0 means: the rectangle can't move
              alerts.style.visibility = "visible" //allows warning panel to popup
              wallWarning.innerText = "WALL HIT 2x PENALITY TIME" // wall touch warning
              scoreNum += 9 // speeds up timer to penailize walls
              hit.play()
              break;
        }
          else if (data[i] < 60 && data[i + 1] > 200 && data[i + 2] < 40) { // lime: #00FF00
              canMove = 2; // 2 is win condition, hitting green
              break;
          }
      }
  }
  else {
      canMove = 1;
  }
  return canMove;
}


canvas.addEventListener("mousemove", function(event){ //mouse control here
  theme.play()
  let rect = canvas.getBoundingClientRect() // abs. size of element
  let trueX = event.clientX - rect.left //true values are the including the window offset
  let trueY = event.clientY - rect.top
  console.log(rect.left)
  //x -117 for screen //-155 for my laptop 
  movingAllowed = canMoveTo(trueX -5, trueY -5);
  let xSpeed = Math.abs((trueX-5) - squareX) //OOB checking
  let ySpeed = Math.abs((trueY-5) - squareY)
  // console.log (event.clientY, event.offsetY)
  canvas.style.cursor = "crosshair"
      if (movingAllowed === 1){
          squareX = trueX -5
          squareY = trueY -5
          wallWarning.innerText = " " 
      }
        else if (movingAllowed === 2) { // 2 meants it hit a green section (aka the end)
            clearInterval(intervalVar); // somehow this works? gotta investigate.
            win.play()
            scoreHolder.innerText = `HURRAY YOU WON! YOUR TIME WAS: ${(scoreNum/60).toFixed(2)}`
            scoreHolder.className = "alert alert-success"
              let form = document.getElementById("myForm")
                    form.style.display = "block"
              let scoretime = document.getElementById("scoretime")
                    scoretime.placeholder = `${((scoreNum/60)+(hax*5)).toFixed(2)}` //5 second penality per wall break
        }
        else if (movingAllowed=== 0 && (xSpeed >24 || ySpeed >24)){
         hax += 1
         bees.play()
         alerts.style.visibility = "visible"
         wallBreak.innerText = `Wall Break Warning! ${hax * 5} seconds added!` //wallbreak warning
        }
    })


//our hand in our scores at end of game popup
document.addEventListener("submit", function(e){
    e.preventDefault()
    let scoreTime = e.target[0].placeholder
    let name = e.target[1].value
    let level = levelnum.innerText
    ++levelnum.innerText //this is where we should change levels
    alerts.style.visibility = "hidden" //reseting warnings and timers
    hax = 0
    scoreNum = 0
    levelMaze = "https://cors-anywhere.herokuapp.com/https://i.imgur.com/upYI237.png"
    drawImage()
    setInterval(drawMazeAndRectangle,1000/60)
    
   
    fetch('http://localhost:3000/api/v1/scores', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({player: name, score: scoreTime, level: level})
    })
    .then(response => console.log(response))
    .then(getScores)
    document.getElementById("myForm").style.display = "none";
})

//start button!
startButton.addEventListener("click", function(e){
    startModal.style.display = "none";
    hax = 0
    scoreNum = 0
})    
drawImage()

