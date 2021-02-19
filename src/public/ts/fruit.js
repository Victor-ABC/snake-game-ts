function Fruit () {
    this.colorArray = ['red', 'blue', 'yellow', 'purple'];
    this.x;
    this.y;
    this.color;
    this.setRandomColor = function () {
        this.color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
    }
    this.setRandomLocation = function(canvas) {
        this.x = Math.floor(Math.random() * canvas.canvas.width / 10) * 10;
        this.y = Math.floor(Math.random() * canvas.canvas.height / 10)* 10;
    }
    this.draw = function (canvas) {
        canvas.draw(this.x, this.y, this.color);
    }
}

