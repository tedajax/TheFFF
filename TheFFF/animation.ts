class Animation {
    maxFrames: number;
    frameImages: ImageTexture[];
    frameDelays: number[];
    currentFrame: number;
    currentTimer: number;
    loop: boolean;
    paused: boolean;

    constructor(imageNames: string[], delays: number[]) {
        this.maxFrames = imageNames.length;
        this.currentFrame = 0;
        this.currentTimer = 0;
        this.frameDelays = delays.slice(0);
        this.loop = true;
        this.paused = true;

        this.frameImages = [];
        for (var i = 0; i < this.maxFrames; ++i) {
            this.frameImages[i] = game.textures.getTexture(imageNames[i]);
        }
    }

    play() {
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