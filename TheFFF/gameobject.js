var GameObject = (function () {
    function GameObject(klass, animations) {
        this.sprite = new Sprite(2, 2);
        this.sprite.setShader(game.spriteShader);
        this.position = new TSM.vec3([0, 0, 0]);
        this.activeAnimation = null;

        var anims = animations && animations || ["idle"];
        this.animations = new AnimationController(klass, anims);

        this.sprite.billboard = true;
        //this.sprite.rotation.x = 45;
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

        var terrainHeight = game.camera.getTerrainHeight(this.position, 0) - 1;
        this.position.z = terrainHeight;
        this.sprite.position = this.position;
    };

    GameObject.prototype.render = function () {
        this.sprite.render();
    };
    return GameObject;
})();
//# sourceMappingURL=gameobject.js.map
