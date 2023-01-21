class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Nipple {
    constructor(leftNipple, rightNipple) {
        this.leftNipple = leftNipple
        this.rightNipple = rightNipple
    }

    getLeftNipple() {
        return this.leftNipple
    }

    getRightNipple() {
        return this.rightNipple;
    }
}

function GetNipple(form) {
    let ret = new Nipple(
        new Point(form.getLeftNippleX(), form.getLeftNippleY()),
        new Point(form.getRightNippleX(), form.getRightNippleY())
    );
    if (ret.leftNipple.x == 0 && ret.leftNipple.y == 0) {
        ret.leftNipple = null;
    }

    if (ret.rightNipple.x == 0 && ret.rightNipple.y == 0) {
        ret.rightNipple = null;
    }
    return ret
}

class Canvas {
    constructor(canvasWidth, canvasHeight) {
        this.canvas = document.getElementById("canvas");
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.ctx = this.canvas.getContext("2d");
    }

    getCanvas() {
        return this.canvas;
    }

    getCtx() {
        return this.ctx;
    }
}

class Form {
    constructor() {
        this.leftNippleX = document.getElementById("left-nipple-x");
        this.leftNippleY = document.getElementById("left-nipple-y");
        this.rightNippleX = document.getElementById("right-nipple-x");
        this.rightNippleY = document.getElementById("right-nipple-y");
    }

    setLeftNippleX(value) {
        this.leftNippleX.value = value;
    }

    setLeftNippleY(value) {
        this.leftNippleY.value = value;
    }

    setRightNippleX(value) {
        this.rightNippleX.value = value;
    }

    setRightNippleY(value) {
        this.rightNippleY.value = value;
    }

    getLeftNippleX() {
        return this.leftNippleX.value;
    }

    getLeftNippleY() {
        return this.leftNippleY.value;
    }

    getRightNippleX() {
        return this.rightNippleX.value;
    }

    getRightNippleY() {
        return this.rightNippleY.value;
    }
}

class ScreenDrawer {
    constructor(canvas) {
        // photo init
        this.photoPath = document.getElementById("photo-path").value;
        this.img = new Image();
        this.img.src = this.photoPath;

        this.canvas = canvas
    }

    drawScreen(nipple) {
        // get canvas context
        const ctx = this.canvas.getCtx();
        // canvas reset
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // define draw process
        const drawProcess = () => {
            this.drawPhoto(ctx);
            this.drawNipplePoint(ctx, nipple);
        };
        // if image is not loaded, wait for loading
        if (!this.img.complete) {
            this.img.onload = () => {
                drawProcess();
            };
            return;
        }
        // if image is loaded, draw
        drawProcess();
    }

    drawPhoto(ctx) {
        const height = canvas.height;
        const width = this.img.width * (height / this.img.height);
        const x = (canvas.width - width) / 2;
        ctx.drawImage(this.img, x, 0, width, height);
    }

    drawNipplePoint(ctx, nipple) {
        if (nipple.getLeftNipple() !== null) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(
                nipple.getLeftNipple().x,
                nipple.getLeftNipple().y,
                10,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }
        if (nipple.getRightNipple() !== null) {
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(
                nipple.getRightNipple().x,
                nipple.getRightNipple().y,
                10,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }
    }
}

class ClickHandler {
    constructor(canvas, form) {
        // init screen drawer
        this.screenDrawer = new ScreenDrawer(canvas);
        this.form = form
    }

    leftClickHandler(e) {
        // set form value
        this.form.setLeftNippleX(e.offsetX);
        this.form.setLeftNippleY(e.offsetY);
        // screen update
        this.screenDrawer.drawScreen(GetNipple(this.form));
    }

    rightClickHandler(e) {
        // set form value
        this.form.setRightNippleX(e.offsetX);
        this.form.setRightNippleY(e.offsetY);
        // screen update
        this.screenDrawer.drawScreen(GetNipple(this.form));
    }
}

class Main {
    constructor() {
        this.canvasWidth = 750;
        this.canvasHeight = 500;
    }

    main() {
        // init
        const canvas = new Canvas(this.canvasWidth, this.canvasHeight);
        const form = new Form();

        // set click handler
        const clickHandler = new ClickHandler(canvas, form);
        canvas.getCanvas().addEventListener("click", (e) => {
            clickHandler.leftClickHandler(e);
        });
        canvas.getCanvas().addEventListener("contextmenu", (e) => {
            e.preventDefault();
            clickHandler.rightClickHandler(e);
        });

        // init screen
        const screenDrawer = new ScreenDrawer(canvas);
        screenDrawer.drawScreen(GetNipple(form));
    }
}

window.onload = function () {
    const main = new Main();
    main.main();
};
