class ImageDatasFetcher {
    constructor() {}

    async fetch() {
        console.log(axios);
    }
}

class FetchingScreenDrawer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    draw() {
        const context = this.canvas.getCtx();
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        context.fillStyle = "black";
        context.font = "20px serif";
        context.fillText("Loading...", 10, 50);
    }
}

export class Fetch {
    constructor(canvas) {
        this.canvas = canvas;
    }

    async run() {
        const fetchingScreenDrawer = new FetchingScreenDrawer(this.canvas);
        fetchingScreenDrawer.draw();

        const imageDatasFetcher = new ImageDatasFetcher();
        const images = await imageDatasFetcher.fetch();
        return images;
    }
}
