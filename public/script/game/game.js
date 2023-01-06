import { EmitWaiter } from "./util.js";
import { CountDown } from "./game/countdown.js";
import { GameMain } from "./game/gamemain.js";

export class GameScreenDrawer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    drawImage(ctx, image) {
        const height = this.canvas.height;
        const width = image.width * (height / image.height);
        const x = (this.canvas.width - width) / 2;
        ctx.drawImage(image, x, 0, width, height);
    }

    drawTime(ctx, time) {
        ctx.fillStyle = "black";
        ctx.font = "48px serif";

        const ms = Math.floor(time * 100) % 100;
        const ss = Math.floor(time) % 60;
        const mm = Math.floor(time / 60);

        const msText = ms < 10 ? `0${ms}` : `${ms}`;
        const ssText = ss < 10 ? `0${ss}` : `${ss}`;
        const mmText = mm < 10 ? `0${mm}` : `${mm}`;
        const timeText = `${mmText}:${ssText}:${msText}`;

        ctx.fillText(timeText, 10, 50);
    }

    draw(data) {
        this.drawImage(data.context, data.image);
        this.drawTime(data.context, data.time);
    }
}

export class Game {
    constructor(canvas, nipples) {
        this.canvas = canvas;
        this.nipples = nipples;
        this.images = [];
        nipples.forEach((element) => {
            const image = new Image();
            image.src = element.path;
            this.images.push(image);
        });
        this.emitWaiter = new EmitWaiter();
    }

    async run() {
        // countdown
        const countDown = new CountDown(this.canvas, this.images[0]);
        // await countDown.run();
        // run game
        const gameMain = new GameMain(this.canvas, this.nipples, this.images);
        await gameMain.run();
        // show score
    }
}
