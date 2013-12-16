var Animation = (function () {
    function Animation(imageNames, delays, loop) {
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
    Animation.prototype.play = function () {
        this.paused = false;
    };

    Animation.prototype.pause = function () {
        this.paused = true;
    };

    Animation.prototype.stop = function () {
        this.paused = true;
        this.currentFrame = 0;
        this.currentTimer = 0;
    };

    Animation.prototype.update = function (dt) {
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
    };

    Animation.prototype.getTexture = function () {
        return this.frameImages[this.currentFrame];
    };
    return Animation;
})();
//# sourceMappingURL=animation.js.map
