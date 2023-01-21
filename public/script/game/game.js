import { CountDown } from "./game/countdown.js";
import { GameMain } from "./game/gamemain.js";
import { Score } from "./game/score.js";

const AudioNames = ["click1", "click2", "countdown1", "countdown2", "finish"];
const MusicNames = ["BGM1", "BGM2"];

class AudioPlayer {
    constructor() {
        this.audios = [];
        AudioNames.forEach((name) => {
            this.audios[name] = new Audio("/sound/" + name + ".mp3");
        });

        this.musics = [];
        MusicNames.forEach((name) => {
            this.musics[name] = new Audio("/sound/" + name + ".mp3");
            this.musics[name].addEventListener(
                "ended",
                () => {
                    this.musics[name].currentTime = 0;
                    this.musics[name].play();
                },
                false
            );
        });
    }

    playAudio(name) {
        this.audios[name].pause();
        this.audios[name].currentTime = 0;
        this.audios[name].play();
    }

    playMusic(name) {
        this.musics[name].play();
    }

    stopMusic(name) {
        this.musics[name].pause();
        this.musics[name].currentTime = 0;
    }
}

export const AudioPlayerInstance = new AudioPlayer();

export class GameScreenDrawer {
    constructor(canvas) {
        this.canvas = canvas;
    }

    drawImage(image) {
        const ctx = this.canvas.getCtx()
        const height = this.canvas.height;
        const width = image.width * (height / image.height);
        const x = (this.canvas.width - width) / 2;
        ctx.drawImage(image, x, 0, width, height);
    }

    drawTime(time) {
        const ctx = this.canvas.getCtx()
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
        this.drawImage(data.image);
        this.drawTime(data.time);
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
    }

    async run() {
        // countdown
        const countDown = new CountDown(this.canvas, this.images[0]);
        await countDown.run();
        // run game
        const gameMain = new GameMain(this.canvas, this.nipples, this.images);
        await gameMain.run();
        // show score
        const score = new Score(
            this.canvas,
            this.images[this.images.length - 1],
            gameMain.getNowTime()
        );
        await score.run();
    }
}
