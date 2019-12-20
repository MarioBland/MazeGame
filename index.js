let canvas = document.getElementById("mazecanvas");
let context = canvas.getContext("2d");
let currRectX = 425;
let currRectY = 3;
let mazeWidth = 600;
let mazeHeight = 600;
let intervalVar;

//making a game piece square 
let squareHeight = 10;
let squareWidth = 10;
let squareX = 18;
let squareY = 18;

function drawPaddle() { //draws square
 
  context.beginPath();
  context.rect(squareX, squareY, squareWidth, squareHeight); //first two are position, second two is x/y size
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
  
}



function drawMazeAndRectangle(rectX, rectY) { //what is rectx and recty?
    // context.clearRect(0, 0, canvas.width, canvas.height)
    makeWhite(0, 0, canvas.width, canvas.height);
    var mazeImg = new Image();
    mazeImg.onload = function () {
        context.drawImage(mazeImg, 0, 0);
        context.beginPath();
        context.arc(403, 590, 7, 0, 2 * Math.PI, false); 
        context.closePath();
        context.fillStyle = '#00FF00';
        context.fill();
    };
    
    console.log(squareX, squareY, squareWidth, squareHeight)
    drawPaddle()
    mazeImg.src = "https://freesvg.org/img/simplemaze.png";
    // requestAnimationFrame(drawMazeAndRectangle) //gotta make this work tommorrow
}

function makeWhite(x, y, w, h) {
    // context.clearRect(0, 0, canvas.width, canvas.height)
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fillStyle = "white";
    context.fill();
}
canvas.addEventListener("mousemove", function(event){ //mouse control here
  canvas.style.cursor = "none"
  squareX = event.clientX 
  squareY = event.clientY  
  })

  

// drawMazeAndRectangle(425, 3);
// context.clearRect(0, 0, canvas.width, canvas.height)
setInterval(drawMazeAndRectangle,1000/60)
