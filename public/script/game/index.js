import { Title } from "./title.js";
import { Fetch } from "./fetch.js";
import { Game } from "./game.js";

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

    async main() {
        const canvas = new Canvas(this.canvasWidth, this.canvasHeight);

        const title = new Title(canvas);
        await title.run();

        const fetch = new Fetch(canvas);
        const images = await fetch.run();

        const game = new Game(canvas, images);
        await game.run();
    }
}

window.onload = function () {
    const main = new Main();
    main.main();
};
