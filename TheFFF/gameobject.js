var GameObject = /** @class */ (function () {
    function GameObject(klass, animations, sprite) {
        if (sprite == null) {
            this.sprite = new Sprite(1, 1);
            this.sprite.setShader(game.spriteShader);
            this.position = new TSM.vec3([0, 0, 0]);
            this.oldPosition = new TSM.vec3([0, 0, 0]);
            this.activeAnimation = null;
            var anims = animations && animations || ["idle"];
            this.animations = new AnimationController(klass, anims);
            this.sprite.billboard = true;
            //this.sprite.rotation.x = 45;
        }
        else {
            this.sprite = sprite;
            this.position = sprite.position;
        }
        this.terrainOffset = 0;
    }
    GameObject.prototype.playAnimation = function (name) {
        this.animations.play(name);
    };
    GameObject.prototype.updateAnimation = function (dt) {
        if (this.animations != null) {
            this.animations.update(dt);
            this.sprite.texture = this.animations.getCurrentTexture();
        }
    };
    GameObject.prototype.setController = function (controller) {
        this.controller = controller;
    };
    GameObject.prototype.update = function (dt) {
        if (this.controller != null) {
            this.oldPosition.xyz = this.position.xyz;
            this.controller.update(dt);
            if (this.oldPosition.y != this.position.y) {
                game.gameObjects.recalcOrder(this.renderOrderIndex);
            }
        }
        this.updateAnimation(dt);
        var terrainHeight = game.terrain.getTerrainHeight(this.position, 0) - (this.sprite.height / 2);
        this.position.z = terrainHeight - this.terrainOffset;
        this.sprite.position = this.position;
    };
    GameObject.prototype.render = function () {
        if (game.camera.inRenderRange(this.position)) {
            this.sprite.render();
        }
    };
    return GameObject;
}());
//# sourceMappingURL=gameobject.js.map