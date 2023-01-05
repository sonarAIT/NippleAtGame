import { Title } from "./title.js";

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

class Main {
    constructor() {
        this.canvasWidth = 750;
        this.canvasHeight = 500;
    }

    main() {
        const canvas = new Canvas(this.canvasWidth, this.canvasHeight);
        const title = new Title(canvas);
        title.run();
    }
}

window.onload = function () {
    const main = new Main();
    main.main();
};
