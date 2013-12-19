var GameObject = (function () {
    function GameObject(klass, animations) {
        this.sprite = new Quad(0, 128, 128);
        this.sprite.setShader(game.spriteShader);
        this.position = new TSM.vec2([0, 0]);
        this.activeAnimation = null;

        var anims = animations && animations || ["idle"];
        this.animations = new AnimationController(klass, anims);
    }
    GameObject.prototype.playAnimation = function (name) {
        this.animations.play(name);
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

        this.animations.update(dt);
        this.sprite.texture = this.animations.getCurrentTexture();

        this.sprite.position = this.position;
    };

    GameObject.prototype.render = function () {
        this.sprite.render();
    };
    return GameObject;
})();
//# sourceMappingURL=gameobject.js.map
