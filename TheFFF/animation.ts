class Animation {
    maxFrames: number;
    frameImages: ImageTexture[];
    frameDelays: number[];
    currentFrame: number;
    currentTimer: number;
    loop: boolean;
    paused: boolean;

    constructor(imageNames: string[], delays: number[], loop?: boolean) {
        this.maxFrames = imageNames.length;
        this.currentFrame = 0;
        this.currentTimer = 0;
        this.frameDelays = delays.slice(0);
        this.loop = (loop == null) ? true : loop;
        this.paused = true;

        this.frameImages = [];
        for (var i = 0; i < this.maxFrames; ++i) {
            this.frameImages[i] = game.textures.getTexture(imageNames[i]);
        }
    }

    play(loop?: boolean) {
        this.paused = false;
        this.loop = (loop == null) ? false : loop;
        this.currentFrame = 0;
        this.currentTimer = 0;
    }

    resume() {
        this.paused = false;
    }

    pause() {
        this.paused = true;
    }

    stop() {
        this.paused = true;
        this.currentFrame = 0;
        this.currentTimer = 0;
    }

    update(dt) {
        if (this.paused) {
            return;
        }

        this.currentTimer += dt;
        if (this.currentTimer >= this.frameDelays[this.currentFrame]) {
            this.currentFrame++;
            if (this.currentFrame >= this.maxFrames) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame--;
                    this.pause();
                }
            }
            this.currentTimer = 0;
        }
    }

    getTexture() {
        return this.frameImages[this.currentFrame];
    }
}