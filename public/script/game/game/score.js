import { AudioPlayerInstance, GameScreenDrawer } from "../game.js";
import { EmitWaiter } from "../util.js";

const comp = {
    restartButton: {
        font: {
            text: "もう一度プレイ",
            size: 30,
            family: "serif",
            location: {
                x: 270,
                y: 385,
            },
        },
        rect: {
            x: 255,
            y: 350,
            w: 240,
            h: 50,
        },
    },
    text1: {
        text: "あなたのスコアは",
        size: 48,
        family: "serif",
        location: {
            x: 183,
            y: 200,
        },
    },
    text2: {
        size: 48,
        family: "serif",
        location: {
            y: 300,
        },
    },
};

const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

class ScoreDrawer {
    constructor(canvas, image, scoreTime) {
        this.canvas = canvas;
        this.image = image;
        this.scoreTime = scoreTime;
        this.gameScreenDrawer = new GameScreenDrawer(canvas);
    }

    draw(propsData) {
        const context = this.canvas.getCtx();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const data = {
            image: this.image,
            time: this.scoreTime,
        };
        this.gameScreenDrawer.draw(data);

        if (propsData.isMouseOnRetartButton) {
            context.fillStyle = "gray";
            context.fillRect(
                comp.restartButton.rect.x,
                comp.restartButton.rect.y,
                comp.restartButton.rect.w,
                comp.restartButton.rect.h
            );
            context.fillStyle = "white";
        } else {
            context.fillStyle = "white";
            context.fillRect(
                comp.restartButton.rect.x,
                comp.restartButton.rect.y,
                comp.restartButton.rect.w,
                comp.restartButton.rect.h
            );
            context.fillStyle = "black";
            context.strokeRect(
                comp.restartButton.rect.x,
                comp.restartButton.rect.y,
                comp.restartButton.rect.w,
                comp.restartButton.rect.h
            );
        }

        context.font = `${comp.restartButton.font.size}px ${comp.restartButton.font.family}`;
        context.fillText(
            comp.restartButton.font.text,
            comp.restartButton.font.location.x,
            comp.restartButton.font.location.y
        );

        context.font = `${comp.text1.size}px ${comp.text1.family}`;
        context.fillStyle = "red";
        context.fillText(
            comp.text1.text,
            comp.text1.location.x,
            comp.text1.location.y
        );

        const ms = Math.floor(this.scoreTime * 100) % 100;
        const ss = Math.floor(this.scoreTime) % 60;
        const mm = Math.floor(this.scoreTime / 60);

        const msText = ms < 10 ? `0${ms}` : `${ms}`;
        const ssText = ss < 10 ? `0${ss}` : `${ss}`;
        const mmText = mm < 10 ? `0${mm}` : `${mm}`;
        const timeText = `${mmText}:${ssText}:${msText}`;

        context.font = `${comp.text2.size}px ${comp.text2.family}`;
        context.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        const timeTextWidth = context.measureText(timeText).width;
        const vibrationX = Math.random() * 5 - 2.5;
        const vibrationY = Math.random() * 5 - 2.5;

        context.fillText(
            timeText,
            (this.canvas.width - timeTextWidth) / 2 + vibrationX,
            comp.text2.location.y + vibrationY
        );
    }
}

export class Score {
    constructor(canvas, image, scoreTime) {
        this.canvas = canvas;

        this.drawer = new ScoreDrawer(canvas, image, scoreTime);
        this.emitWaiter = new EmitWaiter();

        this.mouseClickEvent = null;
        this.mouseMoveEvent = null;

        this.prevIsOnRestartButton = false;

        this.mouseClickEventListener = (e) => {
            this.mouseClickEvent = e;
        };
        this.mouseMoveEventListener = (e) => {
            this.mouseMoveEvent = e;
        };
        const canvasBody = canvas.getCanvas();
        canvasBody.addEventListener("click", this.mouseClickEventListener);
        canvasBody.addEventListener("mousemove", this.mouseMoveEventListener);
    }

    async run() {
        AudioPlayerInstance.playMusic("BGM2");
        const interval = setInterval(() => {
            this.update();
        }, 1000 / 60);
        await this.emitWaiter.wait();
        clearInterval(interval);
        this.destroy();
        AudioPlayerInstance.stopMusic("BGM2");
    }

    isOnRestartButton(e) {
        const rect = comp.restartButton.rect;
        const x = this.mouseMoveEvent.offsetX;
        const y = this.mouseMoveEvent.offsetY;
        if (
            rect.x <= x &&
            x <= rect.x + rect.w &&
            rect.y <= y &&
            y <= rect.y + rect.h
        ) {
            return true;
        }
        return false;
    }

    update() {
        if (this.mouseMoveEvent) {
            this.prevIsOnRestartButton = this.isOnRestartButton(
                this.mouseMoveEvent
            );
            this.mouseMoveEvent = null;
        }

        if (this.mouseClickEvent) {
            if (this.prevIsOnRestartButton) {
                this.emitWaiter.emit();
            }
            this.mouseClickEvent = null;
            return;
        }

        const data = {
            isMouseOnRetartButton: this.prevIsOnRestartButton,
        };
        this.drawer.draw(data);
    }

    destroy() {
        const canvasBody = this.canvas.getCanvas();
        canvasBody.removeEventListener("click", this.mouseClickEventListener);
        canvasBody.removeEventListener(
            "mousemove",
            this.mouseMoveEventListener
        );
    }
}
