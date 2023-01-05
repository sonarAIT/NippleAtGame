import { GameScreenDrawer } from "../game.js";
import { EmitWaiter } from "../util.js";

function EaseOutCubic(t) {
    return Math.pow(1 - t, 3);
}

function getCountDownNumberT(remainingTime) {
    return Math.min(
        EaseOutCubic(
            (remainingTime % TimePerSecOnCountdown) / TimePerSecOnCountdown
        ) * 2,
        1
    );
}

const TimePerSecOnCountdown = 2;
const CountDownSecond = 3;

class CountDownDrawer {
    constructor(canvas, image) {
        this.canvas = canvas;
        this.image = image;
        this.gameScreenDrawer = new GameScreenDrawer(canvas);
    }

    drawCountDownNumber(context, remainingTime) {
        const nowSecond = Math.floor(remainingTime / TimePerSecOnCountdown) + 1;
        const t = getCountDownNumberT(remainingTime);

        const transparency = t;
        const scale = 3 - t * 1.5;

        context.fillStyle = `rgba(255, 0, 0, ${transparency})`;
        context.font = "100px selif";
        const textWidth = context.measureText(nowSecond).width;
        const textHeight = 80;

        context.transform(this.canvas.width / 2, this.canvas.height / 2);
        context.scale(scale, scale);
        context.fillText(
            nowSecond,
            - textWidth / 2,
            textHeight / 2
        );
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    draw(propsData) {
        const context = this.canvas.getCtx();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const data = {
            context: context,
            image: this.image,
            time: 0,
        };
        this.gameScreenDrawer.draw(data);
        this.drawCountDownNumber(context, propsData.remainingTime);
    }
}

export class CountDown {
    constructor(canvas, image) {
        this.drawer = new CountDownDrawer(canvas, image);
        this.emitWaiter = new EmitWaiter();
        this.remainingTime = TimePerSecOnCountdown * CountDownSecond - 0.01;
    }

    async run() {
        this.prevTime = Date.now();
        const interval = setInterval(() => {
            this.update();
        }, 1000 / 60);
        await this.emitWaiter.wait();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        clearInterval(interval);
    }

    update() {
        const nowTime = Date.now();
        const deltaTime = (nowTime - this.prevTime) / 1000;

        const prevRemainingTime = this.remainingTime;
        this.remainingTime -= deltaTime;

        if (this.remainingTime <= 0) {
            this.emitWaiter.emit();
            return;
        }

        const prevT = getCountDownNumberT(prevRemainingTime);
        const t = getCountDownNumberT(this.remainingTime);

        if (prevT < 0.9 && t >= 0.9) {
            // sound
        }

        this.prevTime = nowTime;

        const data = {
            remainingTime: this.remainingTime,
        };
        this.drawer.draw(data);
    }
}
