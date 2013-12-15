var GameObject = (function () {
    function GameObject(textureName) {
        this.sprite = new Quad();
        this.sprite.setShader(game.spriteShader);
        this.sprite.setTexture(game.textures.getTexture(textureName));
        this.position = new TSM.vec2([0, 0]);
    }
    GameObject.prototype.setController = function (controller) {
        this.controller = controller;
    };

    GameObject.prototype.update = function (dt) {
        if (this.controller != null) {
            this.controller.update(dt);
        }

        this.sprite.position = this.position;
    };

    GameObject.prototype.render = function () {
        this.sprite.render();
    };
    return GameObject;
})();
//# sourceMappingURL=gameobject.js.map
