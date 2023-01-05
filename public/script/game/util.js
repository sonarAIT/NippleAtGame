export class EmitWaiter {
    constructor() {
        this.emitter = [];
    }

    emit() {
        this.emitter.forEach((resolve) => {
            resolve();
        });
        this.emitter = [];
    }

    async wait() {
        return new Promise((resolve) => {
            this.emitter.push(resolve);
        });
    }
}
