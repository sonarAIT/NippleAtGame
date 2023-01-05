import { EmitWaiter } from "./util.js";

class GameScreenDrawer {
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
        // draw image
        this.drawImage(data.context, data.image);
        // draw time
        this.drawTime(data.context, data.time);
        // draw effect
    }
}

function EaseOutCubic(t) {
    return Math.pow(1 - t, 3);
}

const TimePerSecOnCountdown = 2;
const CountDownSecond = 3;

class CountDown {
    constructor(canvas, image) {
        this.canvas = canvas;
        this.image = image;
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

    getCountDownNumberT(remainingTime) {
        return Math.min(
            EaseOutCubic(
                (remainingTime % TimePerSecOnCountdown) / TimePerSecOnCountdown
            ) * 2,
            1
        );
    }

    update() {
        const nowTime = Date.now();
        const deltaTime = (nowTime - this.prevTime) / 1000;

        const prevRemainingTime = this.remainingTime;
        this.remainingTime -= deltaTime;

        if (this.remainingTime <= 0) {
            this.emitWaiter.emit();
        }

        const prevT = this.getCountDownNumberT(prevRemainingTime);
        const t = this.getCountDownNumberT(this.remainingTime);

        if (prevT < 1 && t == 1) {
            // sound
        }

        this.prevTime = nowTime;
    }

    drawCountDownNumber(context) {
        const nowSecond =
            Math.floor(this.remainingTime / TimePerSecOnCountdown) + 1;
        const t = this.getCountDownNumberT(this.remainingTime);

        const transparency = t;
        const scale = 3 - t * 1.5;

        context.fillStyle = `rgba(255, 0, 0, ${transparency})`;
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

        const data = {
            context: context,
            image: this.image,
            time: 0,
            effect: [],
        }
        this.gameScreenDrawer.draw(data);
        this.drawCountDownNumber(context);
    }
}

export class Game {
    constructor(canvas, images) {
        this.canvas = canvas;
        this.images = [];
        images.forEach(element => {
            const image = new Image();
            image.src = element.path;
            this.images.push(image);
        });
        this.emitWaiter = new EmitWaiter();
    }

    async run() {
        // countdown
        const countDown = new CountDown(this.canvas, this.images[0]);
        await countDown.run();
        // run game
        // show score
    }
}
