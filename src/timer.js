export default class Timer {
    constructor(delay, cb) {
        this.delay = delay;
        this.timerId = delay;
        this.start = delay;
        this.remaining = delay;

        this.cb = cb;
    }

    run() {
        this.resume();
    }

    pause() {
        clearTimeout(this.timerId);
        this.remaining -= new Date() - this.start;
    }

    resume() {
        this.start = new Date();
        this.timerId = setTimeout(() => {
            this.remaining = this.delay;
            this.resume();
            this.cb();
        }, this.remaining)
    }
}