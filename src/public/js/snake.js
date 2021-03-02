function Snake(scale) {
  this.x = 0;
  this.y = 0;
  this.currentDirection = "Right";

  this.tail = 0;
  this.tailElems = [];

  this.moveX = scale;
  this.moveY = 0;

  this.audio = new audioPlayer();
  this.oneDirectionPerCicle = true;

  this.update = function (canvas) {
    //shiften
    for (let i = this.tail - 2; i >= 0; i--) {
      this.tailElems[i + 1].x = this.tailElems[i].x;
      this.tailElems[i + 1].y = this.tailElems[i].y;
    }
    //shift für Array[pos0]
    if (this.tail > 0) {
      this.tailElems[0].x = this.x;
      this.tailElems[0].y = this.y;
    }
    this.x += this.moveX;
    this.y += this.moveY;
    this.oneDirectionPerCicle = true; //dont touch
    InBoxCheck(this.x, this.y, canvas);
    this.InItselfCheck();
  };
  this.InItselfCheck = function () {
    for (let y = 0; y < this.tail; y++) {
      if (this.x === this.tailElems[y].x && this.y === this.tailElems[y].y) {
        clearInterval(i);
        printGameOver();
      }
    }
  };
  this.draw = function (canvas) {
    canvas.draw(this.x, this.y, "rgb(0, 255, 0)"); //Kopf
    for (let i = 0; i < this.tail; i++) {
      this.tailElems[i].drawTailElement(canvas);
    }
  };
  this.setDirection = function (x, y) {
    if (this.oneDirectionPerCicle) {
      this.moveX = x;
      this.moveY = y;
      this.oneDirectionPerCicle = false;
    }
  };
  this.addTailElement = function (x, y, color, fruitColor) {
    this.tail++;
    this.tailElems[this.tail - 1] = new TailElement(x, y, color);
    this.audio.play(fruitColor);
  };
}
function audioPlayer() {
  this.purpleColor = new Audio("../media/purpleColor.wav");
  this.blueColor = new Audio("../media/blueColor.wav");
  this.redColor = new Audio("../media/redColor.wav");
  this.yellowColor = new Audio("../media/yellowColor.wav");
  this.play = function (colorString) {
    switch (colorString) {
      case "purple":
        this.purpleColor.play();
        break;
      case "blue":
        this.blueColor.play();
        break;
      case "red":
        this.redColor.play();
        break;
      case "yellow":
        this.yellowColor.play();
        break;
    }
  };
}

function TailElement(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.drawTailElement = function (canvas) {
    canvas.draw(this.x, this.y, this.color);
  };
}

function InBoxCheck(x, y, canvas) {
  if (x > canvas.canvas.width) {
    clearInterval(i);
    printGameOver();
  }
  if (x < 0) {
    clearInterval(i);
    printGameOver();
  }
  if (y > canvas.canvas.height) {
    clearInterval(i);
    printGameOver();
  }
  if (y < 0) {
    clearInterval(i);
    printGameOver();
  }
}

function printGameOver() {
  rgbVerlaufIndex = 0;
  //highScore
  highScore = document.getElementById("HighScore").textContent;
  if (score > highScore) {
    highScore = score;
    document.getElementById("HighScore").textContent = highScore;
    updateHighscoreInDatabase(highScore);
  }
  updateCoins(score);
  isOn = false;
  score = 0;
  document.getElementById("score").textContent = score;
  //roter Output "Game Over";
  let header = document.getElementById("headerId");
  let gameOver = document.createElement("h1");
  gameOver.setAttribute("id", "gameOver");
  gameOver.textContent = "Game Over";
  gameOver.style.color = "red";
  gameOver.style.textAlign = "center";
  gameOver.style.fontSize = "1000%";
  gameOver.style.transitionTimingFunction = "ease-in-out";
  gameOver.style.transitionDuration = "0.5s";
  header.appendChild(gameOver);
  setTimeout(() => {
    gameOver.remove();
  }, 2000);
  //Sound
  this.snakeMusic.pause();
  this.deadSound = new Audio("../media/snakeDead.wav");
  this.deadSound.play();
  //Weltrangliste
  setTimeout(() => {
    location.reload();
  }, 3000);
}

function updateHighscoreInDatabase(newHighscore) {
  const user = document.getElementById("playerId").textContent;
  let data = { name: user, highscore: newHighscore };
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/game", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
}
function updateCoins(coins) {
  const user = document.getElementById("playerId").textContent;
  let data = { name: user, coins: coins };
  let request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/shop/addcoins", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
}
