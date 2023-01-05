import { EmitWaiter } from "./util.js";

class GameScreenDrawer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    draw(data) {
        // draw image
        // draw time
        // draw effect
    }
}

function EaseOutCubic(t) {
    return Math.pow(1 - t, 3);
}

const TimePerSecOnCountdown = 2;
const CountDownSecond = 3;

class CountDown {
    constructor(canvas, images) {
        this.canvas = canvas;
        this.images = images;
        this.gameScreenDrawer = new GameScreenDrawer(this.canvas);
        this.emitWaiter = new EmitWaiter();
        this.remainingTime = TimePerSecOnCountdown * CountDownSecond - 0.01;
    }

    async run() {
        this.prevTime = Date.now();
        const interval = setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / 60);
        await this.emitWaiter.wait();
        clearInterval(interval);
    }

    update() {
        const nowTime = Date.now();
        const deltaTime = (nowTime - this.prevTime) / 1000;

        const prevRemainingTime = this.remainingTime;
        this.remainingTime -= deltaTime;

        if (this.remainingTime <= 0) {
            this.emitWaiter.emit();
        }

        const floorPrevRemainingTime = Math.floor(
            prevRemainingTime / TimePerSecOnCountdown
        );
        const floorRemainingTime = Math.floor(
            this.remainingTime / TimePerSecOnCountdown
        );

        if (floorPrevRemainingTime !== floorRemainingTime) {
            // sound
        }

        this.prevTime = nowTime;
    }

    drawCountDownNumber() {
        const nowSecond =
            Math.floor(this.remainingTime / TimePerSecOnCountdown) + 1;
        const t = Math.min(
            EaseOutCubic(
                (this.remainingTime % TimePerSecOnCountdown) /
                    TimePerSecOnCountdown
            ) * 2,
            1
        );

        const transparency = t;
        const scale = 3 - t * 1.5;

        context.fillStyle = `rgba(0, 0, 0, ${transparency})`;
        context.font = "100px selif";
        const textWidth = context.measureText(nowSecond).width;

        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.fillText(
            nowSecond,
            (this.canvas.width / scale - textWidth) / 2,
            this.canvas.height / scale / 2
        );
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    draw() {
        const context = this.canvas.getCtx();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.gameScreenDrawer.draw();
        this.drawCountDownNumber();
    }
}

export class Game {
    constructor(canvas, images) {
        this.canvas = canvas;
        this.images = images;
        this.emitWaiter = new EmitWaiter();
    }

    async run() {
        // countdown
        const countDown = new CountDown(this.canvas, this.images);
        await countDown.run();
        // run game
        // show score
    }
}
