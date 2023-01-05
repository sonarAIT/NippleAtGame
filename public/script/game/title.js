import { EmitWaiter } from "./util.js";

const comp = {
    startButton: {
        font: {
            text: "はじめる",
            size: 30,
            family: "serif",
            location: {
                x: 315,
                y: 385,
            },
        },
        rect: {
            x: 300,
            y: 350,
            w: 150,
            h: 50,
        },
    },
    titleFont: {
        text: "乳首あてゲーム",
        size: 48,
        family: "serif",
        location: {
            x: 210,
            y: 200,
        },
    },
};

function IsMouseOnButtonChecker(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    const rect = comp.startButton.rect;
    return (
        x >= rect.x &&
        x <= rect.x + rect.w &&
        y >= rect.y &&
        y <= rect.y + rect.h
    );
}

class TitleScreenDrawer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    draw(data) {
        const context = this.canvas.getCtx();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        // draw title
        context.fillStyle = "black";
        context.font = `${comp.titleFont.size}px ${comp.titleFont.family}`;
        context.fillText(
            comp.titleFont.text,
            comp.titleFont.location.x,
            comp.titleFont.location.y
        );

        // draw start button
        if (data.isMouseOnStartButton) {
            context.fillStyle = "gray";
            context.fillRect(
                comp.startButton.rect.x,
                comp.startButton.rect.y,
                comp.startButton.rect.w,
                comp.startButton.rect.h
            );
            context.fillStyle = "white";
        } else {
            context.strokeRect(
                comp.startButton.rect.x,
                comp.startButton.rect.y,
                comp.startButton.rect.w,
                comp.startButton.rect.h
            );
        }

        context.font = `${comp.startButton.font.size}px ${comp.startButton.font.family}`;
        context.fillText(
            comp.startButton.font.text,
            comp.startButton.font.location.x,
            comp.startButton.font.location.y
        );
        console.log(context.measureText(comp.startButton.font.text))
    }
}

class TitleMouseClickEventHandler {
    constructor(endWaiter) {
        this.endWaiter = endWaiter;
    }

    handle(e) {
        if (IsMouseOnButtonChecker(e)) {
            this.endWaiter.emit();
        }
    }
}

class TitleMouseMoveEventHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.titleScreenDrawer = new TitleScreenDrawer(canvas);
    }

    handle(e) {
        // draw
        const data = {
            isMouseOnStartButton: IsMouseOnButtonChecker(e),
        };
        this.titleScreenDrawer.draw(data);
    }
}

export class Title {
    constructor(canvas) {
        // set title end waiter
        this.endWaiter = new EmitWaiter();
        // set canvas event listener
        this.canvas = canvas;
        const titleMouseClickEventHandler = new TitleMouseClickEventHandler(
            this.endWaiter
        );
        const titleMouseMoveEventHandler = new TitleMouseMoveEventHandler(
            canvas
        );
        this.titleMouseClickEventHandle = (e) => {
            titleMouseClickEventHandler.handle(e);
        };
        this.titleMouseMoveEventHandle = (e) => {
            titleMouseMoveEventHandler.handle(e);
        };
        const canvasBody = this.canvas.getCanvas();
        canvasBody.addEventListener("click", this.titleMouseClickEventHandle);
        canvasBody.addEventListener(
            "mousemove",
            this.titleMouseMoveEventHandle
        );

        // draw title screen
        const titleScreenDrawer = new TitleScreenDrawer(canvas);
        titleScreenDrawer.draw({
            isMouseOnStartButton: false,
        });
    }

    async run() {
        // wait for end
        await this.endWaiter.wait();
        this.destroy();
    }

    destroy() {
        // remove canvas event listener
        const canvasBody = this.canvas.getCanvas();
        canvasBody.removeEventListener(
            "click",
            this.titleMouseClickeEventHandle
        );
        canvasBody.removeEventListener(
            "mousemove",
            this.titleMouseMoveEventHandle
        );
    }
}
