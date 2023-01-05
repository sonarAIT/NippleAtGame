import { EmitWaiter } from "./util.js";
import { CountDown } from "./game/countdown.js";

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
        // draw image
        this.drawImage(data.context, data.image);
        // draw time
        this.drawTime(data.context, data.time);
    }
}

const Tolerance = 30;

class NippleStarEffect {
    constructor(point) {

    }

    isEnd() {
        return true;
    }

    update(deltaTime) {}

    draw(ctx) {}
}

class OKEffect {
    constructor() {}

    isEnd() {
        return true;
    }

    update(deltaTime) {}

    draw(ctx) {}
}

class GameMainDrawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gameScreenDrawer = new GameScreenDrawer(canvas);
    }

    drawNipple(ctx, nipple) {
        if(!nipple.isClicked) {
            return;
        }

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(nipple.X, nipple.Y, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    drawEffects(ctx, effects) {
        effects.forEach((effect) => {
            effect.draw(ctx);
        });
    }

    draw(propsData) {
        const context = this.canvas.getCtx();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const data = {
            context: context,
            image: propsData.image,
            time: propsData.time,
        };
        this.gameScreenDrawer.draw(data);
        this.drawNipple(context, propsData.leftNipple);
        this.drawNipple(context, propsData.rightNipple);
        this.drawEffects(context, propsData.effects);
    }
}

class GameMain {
    constructor(canvas, nipples, images) {
        this.nipples = nipples;
        this.images = images;

        this.drawer = new GameMainDrawer(canvas);
        this.emitWaiter = new EmitWaiter();

        this.mouseClickEvent = null;
        this.prevTime = 0;

        this.effects = [];
        this.nowTime = 0;
        this.nowQuestion = 0;
        this.isLeftNippleClicked = false;
        this.isRightNippleClicked = false;

        canvas.getCanvas().addEventListener("click", (e) => {
            this.mouseClickEvent = e;
        });
    }

    async run() {
        this.prevTime = Date.now();
        const interval = setInterval(() => {
            this.update();
        }, 1000 / 60);
        await this.emitWaiter.wait();
        clearInterval(interval);
    }

    checkNippleClicked(e) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        const nipple = this.nipples[this.nowQuestion];

        if (
            mouseX >= nipple.leftNippleX - Tolerance / 2 &&
            mouseX <= nipple.leftNippleX + Tolerance / 2 &&
            mouseY >= nipple.leftNippleY - Tolerance / 2 &&
            mouseY <= nipple.leftNippleY + Tolerance / 2 &&
            !this.isLeftNippleClicked
        ) {
            this.isLeftNippleClicked = true;
            this.effects.push(new NippleStarEffect({
                x: nipple.leftNippleX,
                y: nipple.leftNippleY,
            }));
            return;
        }

        if (
            mouseX >= nipple.rightNippleX - Tolerance / 2 &&
            mouseX <= nipple.rightNippleX + Tolerance / 2 &&
            mouseY >= nipple.rightNippleY - Tolerance / 2 &&
            mouseY <= nipple.rightNippleY + Tolerance / 2 &&
            !this.isRightNippleClicked
        ) {
            this.isRightNippleClicked = true;
            this.effects.push(new NippleStarEffect({
                x: nipple.rightNippleX,
                y: nipple.rightNippleY,
            }));
        }
    }

    update() {
        const now = Date.now();
        const deltaTime = (now - this.prevTime) / 1000;

        this.nowTime += deltaTime;

        if (this.mouseClickEvent) {
            this.checkNippleClicked(this.mouseClickEvent);
            this.mouseClickEvent = null;
        }

        if (this.isLeftNippleClicked && this.isRightNippleClicked) {
            this.nowQuestion++;
            if (this.nowQuestion >= this.images.length) {
                this.emitWaiter.emit();
                return;
            }

            this.isLeftNippleClicked = false;
            this.isRightNippleClicked = false;
            this.effects.push(new OKEffect());
        }

        this.effects.forEach((effect) => {
            effect.update(deltaTime);
        });

        this.effects = this.effects.filter((effect) => {
            return !effect.isEnd();
        });

        this.prevTime = now;

        const data = {
            image: this.images[this.nowQuestion],
            time: this.nowTime,
            effects: this.effects,
            leftNipple: {
                isClicked: this.isLeftNippleClicked,
                X: this.nipples[this.nowQuestion].leftNippleX,
                Y: this.nipples[this.nowQuestion].leftNippleY,
            },
            rightNipple: {
                isClicked: this.isRightNippleClicked,
                X: this.nipples[this.nowQuestion].rightNippleX,
                Y: this.nipples[this.nowQuestion].rightNippleY,
            },
        };
        this.drawer.draw(data);
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
        await countDown.run();
        // run game
        const gameMain = new GameMain(this.canvas, this.nipples, this.images);
        await gameMain.run();
        // show score
    }
}
