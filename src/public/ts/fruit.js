function Fruit() {
  this.colorArray = ["red", "blue", "yellow", "purple"];
  this.x;
  this.y;
  this.color;
  this.setRandomColor = function () {
    this.color = this.colorArray[
      Math.floor(Math.random() * this.colorArray.length)
    ];
  };
  this.setRandomLocation = function (canvas) {
    this.x = Math.floor((Math.random() * canvas.canvas.width) / 10) * 10;
    this.y = Math.floor((Math.random() * canvas.canvas.height) / 10) * 10;
    // Check if it spawned in snake
    // Snake head
    if (this.x === snake.x && this.y === snake.y) {
      console.log("neu berechnet");
      this.setRandomLocation(canvas);
    }
    // Snake Before Head
    if (this.x === snake.x + snake.moveX && this.y === snake.y + snake.moveY) {
      console.log("neu berechnet");
      this.setRandomLocation(canvas);
    }
    // Snake tail check
    for (let i = 0; i < snake.tailElems.length; i++) {
      if (this.x === snake.tailElems[i].x && this.y === snake.tailElems[i].y) {
        console.log("neu berechnet");
        this.setRandomLocation(canvas);
      }
    }
  };
  this.draw = function (canvas) {
    canvas.draw(this.x, this.y, this.color);
  };
}
