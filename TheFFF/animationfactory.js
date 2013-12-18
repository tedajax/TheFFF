var AnimationFactory = (function () {
    function AnimationFactory() {
        this.animations = [];
    }
    AnimationFactory.prototype.getAnimation = function (klass, name) {
        if (this.animations == null) {
            throw new Error("Must instantiate animation factory before calling createAnimation()");
        }

        if (this.animations[klass] == null) {
            return null;
        }

        return this.animations[klass][name];
    };

    AnimationFactory.prototype.createAnimation = function (klass, name, textureRootName, numFrames, frameDelays) {
        if (this.animations == null) {
            throw new Error("Must instantiate animation factory before calling createAnimation()");
        }

        if (this.animations[klass] == null) {
            this.animations[klass] = [];
        }

        if (this.animations[klass][name] == null) {
            if (frameDelays == null) {
                frameDelays = [];
                for (var i = 0; i < numFrames; ++i) {
                    frameDelays[i] = AnimationFactory.defaultFrameDelay;
                }
            }

            var textureNames = [];
            for (var i = 0; i < numFrames; ++i) {
                var tex = textureRootName.slice(0);
                if (i < 10) {
                    tex += "0";
                }
                tex += i.toString();
                textureNames[i] = tex;
            }

            this.animations[klass][name] = new Animation(textureNames, frameDelays);
        }

        return this.animations[klass][name];
    };
    AnimationFactory.defaultFrameDelay = 0.2;
    return AnimationFactory;
})();
//# sourceMappingURL=animationfactory.js.map
