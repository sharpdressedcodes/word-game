export default class Timer {

    static DEFAULT_INTERVAL = 1000;
    static DEFAULT_TIMEOUT = 5000;
    static DEFAULT_INTERVAL_CALLBACK = Function.prototype;
    static DEFAULT_TIMEOUT_CALLBACK = Function.prototype;

    timerId = null;
    count = 0;

    onInterval = () => {
        this.count += this.interval;

        if (this.count >= this.timeout) {
            clearInterval(this.timerId);
            this.timerId = null;
            this.timeoutCallback();
            return;
        }

        this.intervalCallback(this.count);
    };

    constructor(interval = Timer.DEFAULT_INTERVAL, timeout = Timer.DEFAULT_TIMEOUT, intervalCallback = Timer.DEFAULT_INTERVAL_CALLBACK, timeoutCallback = Timer.DEFAULT_TIMEOUT_CALLBACK) {
        this.interval = interval;
        this.timeout = timeout;
        this.intervalCallback = intervalCallback;
        this.timeoutCallback = timeoutCallback;
    }

    start() {
        this.count = 0;
        this.timerId = setInterval(this.onInterval, this.interval);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    restart() {
        this.stop();
        this.start();    }
}
