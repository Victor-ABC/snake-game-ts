export class Fruit {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.colorArray = ["red", "blue", "yellow", "purple"];
        this.color = "green";
    }
    setRandomColor() {
        this.color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
    }
    setRandomLocation(canvas, snake) {
        this.x = Math.floor((Math.random() * canvas.getWidth()) / 10) * 10;
        this.y = Math.floor((Math.random() * canvas.getHeight()) / 10) * 10;
        // Check if it spawned in snake
        if (!snake.fruitPlacedSuccessfully(this.x, this.y)) {
            // Snake head
            this.setRandomLocation(canvas, snake);
        }
    }
    draw(canvas) {
        canvas.draw(this.y, this.y, this.color);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}
