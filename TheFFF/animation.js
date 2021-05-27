var FFFAnimation = /** @class */ (function () {
    function FFFAnimation(imageNames, delays, priority) {
        if (priority === void 0) { priority = 0; }
        this.maxFrames = imageNames.length;
        this.currentFrame = 0;
        this.currentTimer = 0;
        this.frameDelays = delays.slice(0);
        this.loop = false;
        this.playing = false;
        this.priority = priority;
        this.frameNames = [];
        this.frameImages = [];
        for (var i = 0; i < this.maxFrames; ++i) {
            this.frameNames[i] = imageNames[i];
            this.frameImages[i] = game.textures.getTexture(imageNames[i]);
        }
    }
    FFFAnimation.prototype.clone = function () {
        return new FFFAnimation(this.frameNames, this.frameDelays, this.priority);
    };
    FFFAnimation.prototype.play = function (loop) {
        if (loop === void 0) { loop = false; }
        this.playing = true;
        this.loop = loop;
        this.currentFrame = 0;
        this.currentTimer = 0;
    };
    FFFAnimation.prototype.resume = function () {
        this.playing = true;
    };
    FFFAnimation.prototype.pause = function () {
        this.playing = false;
    };
    FFFAnimation.prototype.stop = function () {
        this.playing = false;
        this.currentFrame = 0;
        this.currentTimer = 0;
    };
    FFFAnimation.prototype.update = function (dt) {
        if (!this.playing) {
            return;
        }
        this.currentTimer += dt;
        if (this.currentTimer >= this.frameDelays[this.currentFrame]) {
            this.currentFrame++;
            if (this.currentFrame >= this.maxFrames) {
                if (this.loop) {
                    this.currentFrame = 0;
                }
                else {
                    this.currentFrame--;
                    this.pause();
                }
            }
            this.currentTimer = 0;
        }
    };
    FFFAnimation.prototype.getTexture = function () {
        return this.frameImages[this.currentFrame];
    };
    return FFFAnimation;
}());
//# sourceMappingURL=animation.js.map