var GameObject = (function () {
    function GameObject(textureName) {
        this.sprite = new Quad(0, 128, 128);
        this.sprite.setShader(game.spriteShader);
        this.sprite.setTexture(game.textures.getTexture(textureName));
        this.position = new TSM.vec2([0, 0]);
        this.animations = [];
        this.activeAnimation = null;
    }
    GameObject.prototype.addAnimation = function (name, textureRootName, numFrames, loop, frameDelays) {
        if (this.animations[name] != null) {
            return;
        }

        if (frameDelays == null) {
            frameDelays = [];
            for (var i = 0; i < numFrames; ++i) {
                frameDelays[i] = 0.2;
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

        this.animations[name] = new Animation(textureNames, frameDelays, loop);
    };

    GameObject.prototype.setActiveAnimation = function (name) {
        if (this.animations[name] == null) {
            return;
        }

        this.activeAnimation = name;
        this.animations[this.activeAnimation].play();
    };

    GameObject.prototype.updateAnimation = function (dt) {
        this.animations[this.activeAnimation].update(dt);
    };

    GameObject.prototype.setController = function (controller) {
        this.controller = controller;
    };

    GameObject.prototype.update = function (dt) {
        if (this.controller != null) {
            this.controller.update(dt);
        }

        if (this.activeAnimation != null) {
            this.updateAnimation(dt);
            this.sprite.texture = this.animations[this.activeAnimation].getTexture();
        }

        this.sprite.position = this.position;
    };

    GameObject.prototype.render = function () {
        this.sprite.render();
    };
    return GameObject;
})();
//# sourceMappingURL=gameobject.js.map
