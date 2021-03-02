scale = 10;
isOn = false;
const canvas = new Canvas(scale);

var rgbVerlaufIndex = 0;
var rgbVerlauf = [
  "rgb(0, 204, 0)",
  "rgb(0, 204, 51)",
  "rgb(0, 204, 102)",
  "rgb(0, 204, 153)",
  "rgb(0, 204, 204)",
  "rgb(0, 153, 204)",
  "rgb(0, 102, 204)",
  "rgb(0, 51, 204)",
  "rgb(0, 0, 204)",
  "rgb(51, 0, 204)",
  "rgb(102, 0, 204)",
  "rgb(153, 0, 204)",
  "rgb(204, 0, 204)",
  "rgb(204, 0, 153)",
  "rgb(204, 0, 102)",
  "rgb(204, 0, 51)",
  "rgb(204, 0, 0)",
  "rgb(204, 51, 0)",
  "rgb(204, 102, 0)",
  "rgb(204, 153, 0)",
  "rgb(204, 204, 0)",
  "rgb(153, 204, 0)",
  "rgb(102, 204, 0)",
  "rgb(51, 204, 0)",
];
var score = 0;
var highScore = 0;
var snake;
var fruit;
var i;
var snakeMusic = new Audio("../media/snakeGameMusic.mp3");
function setUp() {
  if (!isOn) {
    isOn = true;
    snake = new Snake(scale);
    fruit = new Fruit();
    fruit.setRandomColor();
    fruit.setRandomLocation(canvas);

    //GameMusic
    snakeMusic.play();

    i = setInterval(() => {
      canvas.clean(); //feld freiräumen

      fruit.draw(canvas);
      snake.update(canvas);
      snake.draw(canvas);
      if (snake.x === fruit.x && snake.y === fruit.y) {
        snake.addTailElement(
          undefined,
          undefined,
          rgbVerlauf[rgbVerlaufIndex % rgbVerlauf.length],
          fruit.color
        );
        rgbVerlaufIndex++;
        fruit.setRandomColor();
        fruit.setRandomLocation(canvas);
        updateScore(10);
      }
    }, 250);
  }
}

function updateScore(newNr) {
  this.score += newNr;
  document.getElementById("score").textContent = this.score;
}
