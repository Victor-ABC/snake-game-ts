import { Canvas } from "./canvas";
import { Fruit } from "./fruit";
import { Snake } from "./snake";
class Game {
    constructor(scale) {
        this.snake = new Snake();
        this.fruit = new Fruit();
        this.canvas = new Canvas(scale);
        this.isCurrentlyRunning = false;
        this.rgbVerlaufIndex = 0;
        this.rgbVerlauf = [
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
        this.color = "green";
        this.score = 0;
    }
    play() {
        if (!this.isCurrentlyRunning) {
            this.isCurrentlyRunning = true;
            this.fruit.setRandomColor();
            this.fruit.setRandomLocation(this.canvas, this.snake);
            // hide color while playing
            document.getElementById("color-select").style.visibility = "hidden";
            this.gameInterval = setInterval(() => {
                this.canvas.clean(); //feld freiräumen
                this.fruit.draw(this.canvas);
                this.snake.update(this.canvas);
                this.snake.draw(this.canvas);
                if (this.snake.inItself()) {
                    //inItself = "Selbstgefressen"
                    this.stop();
                }
                if (this.snake.outOfMap(this.canvas)) {
                    this.stop();
                }
                if (this.snake.isOnFruitCheck(this.fruit.getX(), this.fruit.getY())) {
                    this.snake.addTailElement(0, 0, this.color); // !Hier nochmal schauen, ob ohne x, y geht
                    this.fruit.setRandomColor();
                    this.fruit.setRandomLocation(this.canvas, this.snake);
                }
            }, 250);
        }
    }
    stop() {
        if (this.isCurrentlyRunning) {
            this.isCurrentlyRunning = false;
            clearInterval(this.gameInterval);
            this.printGameOver();
        }
    }
    printGameOver() {
        let gameOver = document.createElement("h1");
        gameOver.classList.add("game-over");
        this.canvas.getCanvas().appendChild(gameOver);
        setTimeout(() => {
            gameOver.remove();
        }, 2000);
        setTimeout(() => {
            location.reload();
        }, 3000);
    }
    getSnake() {
        return this.snake;
    }
    getCanvas() {
        return this.canvas;
    }
}
const game = new Game(10);
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowRight":
            if (game.getSnake().getCurrentDirection() !== "Left") {
                game.getSnake().setCurrentDirection("Right");
                game.getSnake().setDirection(game.getCanvas().getScale(), 0);
            }
            break;
        case "ArrowLeft":
            if (game.getSnake().getCurrentDirection() !== "Right") {
                game.getSnake().setCurrentDirection("Left");
                game.getSnake().setDirection(-game.getCanvas().getScale(), 0);
            }
            break;
        case "ArrowDown":
            if (game.getSnake().getCurrentDirection() !== "Up") {
                game.getSnake().setCurrentDirection("Down");
                game.getSnake().setDirection(0, game.getCanvas().getScale());
            }
            break;
        case "ArrowUp":
            if (game.getSnake().getCurrentDirection() !== "Down") {
                game.getSnake().setCurrentDirection("Up");
                game.getSnake().setDirection(0, -game.getCanvas().getScale());
            }
            break;
    }
});
document.getElementById("start").onclick = function () {
    game.play();
};
