/// <reference path="TSM/tsm.ts" />
var Camera2D = (function () {
    function Camera2D() {
        this.position = new TSM.vec2([0, 0]);
    }
    Camera2D.prototype.update = function () {
        if (this.gameObjectToFollow != null) {
            this.position = TSM.vec2.sum(this.gameObjectToFollow.position, new TSM.vec2([(-game.width / 2) + 32, (-game.height / 2) + 32]));
        }
    };

    Camera2D.prototype.move = function (velocity) {
        this.position.subtract(velocity);
    };

    Camera2D.prototype.getProjectionMatrix = function () {
        return TSM.mat4.orthographic(0 + this.position.x, game.width + this.position.x, game.height + this.position.y, 0 + this.position.y, 0, 1);
    };

    Camera2D.prototype.getViewMatrix = function () {
        return TSM.mat4.lookAt(new TSM.vec3([0, 0, 0]), new TSM.vec3([0, 0, -1]), new TSM.vec3([0, 1, 0]));
    };
    return Camera2D;
})();
//# sourceMappingURL=camera.js.map
