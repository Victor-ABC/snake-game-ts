export class Canvas {
    constructor(scale) {
        this.canvas = document.querySelector(".canvas");
        this.canvas.focus();
        this.ctx = this.canvas.getContext("2d");
        this.scale = scale;
    }
    draw(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.scale, this.scale);
    }
    clean() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawImage(image, x, y, height, width) {
        this.ctx.drawImage(image, x, y, height, width);
    }
    getWidth() {
        return this.canvas.width;
    }
    getHeight() {
        return this.canvas.height;
    }
    getCanvas() {
        return this.canvas;
    }
    getScale() {
        return this.scale;
    }
}
