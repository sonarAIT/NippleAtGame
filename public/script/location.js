class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Nipple {
    constructor() {
        this.leftNipple = null;
        this.rightNipple = null;
    }

    setLeftNipple(point) {
        this.leftNipple = point;
    }

    setRightNipple(point) {
        this.rightNipple = point;
    }

    getLeftNipple() {
        return this.leftNipple;
    }

    getRightNipple() {
        return this.rightNipple;
    }
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
}

class ScreenDrawer {
    constructor() {
        // photo init
        this.photoPath = document.getElementById("photo-path").value;
        this.img = new Image();
        this.img.src = this.photoPath;
    }

    drawScreen(canvas, nipple) {
        // get canvas context
        const ctx = canvas.getCtx();
        // canvas reset
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // define draw process
        const drawProcess = () => {
            this.drawPhoto(ctx);
            this.drawNipplePoint(ctx, nipple);
        }
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
    constructor() {
        // init screen drawer
        this.screenDrawer = new ScreenDrawer();
    }

    leftClickHandler(e, canvas, form, nipple) {
        // set nipple value
        nipple.setLeftNipple(new Point(e.offsetX, e.offsetY));
        // screen update
        this.screenDrawer.drawScreen(canvas, nipple);
        // set form value
        form.setLeftNippleX(e.offsetX);
        form.setLeftNippleY(e.offsetY);
    }

    rightClickHandler(e, canvas, form, nipple) {
        // set nipple value
        nipple.setRightNipple(new Point(e.offsetX, e.offsetY));
        // screen update
        this.screenDrawer.drawScreen(canvas, nipple);
        // set form value
        form.setRightNippleX(e.offsetX);
        form.setRightNippleY(e.offsetY);
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
        const nipple = new Nipple();

        // set click handler
        const clickHandler = new ClickHandler();
        canvas.getCanvas().addEventListener("click", (e) => {
            clickHandler.leftClickHandler(e, canvas, form, nipple);
        });
        canvas.getCanvas().addEventListener("contextmenu", (e) => {
            e.preventDefault();
            clickHandler.rightClickHandler(e, canvas, form, nipple);
        });

        // init screen
        const screenDrawer = new ScreenDrawer();
        screenDrawer.drawScreen(canvas, nipple);
    }
}

window.onload = function () {
    const main = new Main();
    main.main();
};
