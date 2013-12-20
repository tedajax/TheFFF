/// <reference path="tsm-0.7.d.ts" />
var Camera2D = (function () {
    function Camera2D() {
        this.position = new TSM.vec3([0, 0, -2]);
        this.lookAt = new TSM.vec3([0, 0, 0]);
        this.up = new TSM.vec3([0, 0, -1]);
    }
    Camera2D.prototype.update = function (dt) {
        if (this.gameObjectToFollow != null) {
            var position2D = TSM.vec2.sum(this.gameObjectToFollow.position, this.followOffset);
            this.position.x = position2D.x;
            this.position.y = position2D.y;
        }
        this.lookAt.x = this.position.x;
        this.lookAt.y = this.position.y - 2;
    };

    Camera2D.prototype.follow = function (go) {
        this.gameObjectToFollow = go;
        this.followOffset = new TSM.vec2([(-20 / 2) + go.sprite.width / 2, (-20 / 2) + go.sprite.height / 2]);
    };

    Camera2D.prototype.move = function (velocity) {
        this.position.x -= velocity.x;
        this.position.y -= velocity.y;
    };

    Camera2D.prototype.getProjectionMatrix = function () {
        var aspect = game.width / game.height;
        return TSM.mat4.perspective(90, game.width / game.height, 0.1, 1000);
        //return TSM.mat4.orthographic(0 + this.position.x, game.width + this.position.x, game.height + this.position.y, 0 + this.position.y, 0, 1);
        //return TSM.mat4.orthographic(0, game.width, game.height, 0, 0, 100);
    };

    Camera2D.prototype.getViewMatrix = function () {
        return TSM.mat4.lookAt(this.position, this.lookAt, this.up);
    };
    return Camera2D;
})();
//# sourceMappingURL=camera.js.map
