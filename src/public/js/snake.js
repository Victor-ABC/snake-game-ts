export class Snake {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.currentDirection = "Right";
        this.tailIndex = 0;
        this.tailElems = [];
        this.oneDirectionPerCicle = true;
    }
    getCurrentDirection() {
        return this.currentDirection;
    }
    setCurrentDirection(newDirection) {
        this.currentDirection = newDirection;
    }
    update(canvas) {
        for (let i = this.tailIndex - 2; i >= 0; i--) {
            this.tailElems[i + 1].setX(this.tailElems[i].getX());
            this.tailElems[i + 1].setY(this.tailElems[i].getY());
        }
        //shift für Array[pos0]
        if (this.tailIndex > 0) {
            this.tailElems[0].setX(this.x);
            this.tailElems[0].setY(this.y);
        }
        this.x += this.moveX;
        this.y += this.moveY;
        this.oneDirectionPerCicle = true; //dont touch
    }
    inItself() {
        for (let i = 0; i < this.tailIndex; i++) {
            if (this.x === this.tailElems[i].getX() &&
                this.y === this.tailElems[i].getY()) {
                return true;
            }
        }
        return false;
    }
    draw(canvas) {
        if (false) {
            canvas.draw(this.x, this.y, "rgb(51, 204, 0)"); //Kopf
        }
        else {
            canvas.draw(this.x, this.y, "green"); //Kopf
        }
        for (let i = 0; i < this.tailIndex; i++) {
            this.tailElems[i].drawTailElement(canvas);
        }
    }
    setDirection(x, y) {
        if (this.oneDirectionPerCicle) {
            this.moveX = x;
            this.moveY = y;
            this.oneDirectionPerCicle = false;
        }
    }
    addTailElement(x, y, color) {
        this.tailIndex++;
        this.tailElems[this.tailIndex - 1] = new TailElement(x, y, color);
    }
    outOfMap(canvas) {
        if (this.x > canvas.getWidth()) {
            return true;
        }
        if (this.x < 0) {
            return true;
        }
        if (this.y > canvas.getHeight()) {
            return true;
        }
        if (this.y < 0) {
            return true;
        }
        return false;
    }
    fruitPlacedSuccessfully(fruitPosX, fruitPosY) {
        if (this.isOnFruitCheck(fruitPosX, fruitPosY)) {
            // Snake head
            return false;
        }
        this.tailElems.forEach((e) => {
            // Snake body
            if (e.getX() === fruitPosX && e.getY() === fruitPosY) {
                return false;
            }
        });
        return true;
    }
    isOnFruitCheck(fruitPosX, fruitPosY) {
        if (this.x === fruitPosX && this.y === fruitPosY) {
            // Snake head
            return true;
        }
        return false;
    }
}
class TailElement {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    drawTailElement(canvas) {
        canvas.draw(this.x, this.y, this.color);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setX(newX) {
        this.x = newX;
    }
    setY(newY) {
        this.y = newY;
    }
}
