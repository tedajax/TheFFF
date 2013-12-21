/// <reference path="tsm-0.7.d.ts" />
var Camera2D = (function () {
    function Camera2D() {
        this.position = new TSM.vec3([0, 0, 0]);
        this.lookAt = new TSM.vec3([0, 0, 0]);
        this.up = new TSM.vec3([0, 0, -1]);

        this.cameraAngle = 45;
        this.followDistance = Math.sqrt(8);

        this.positionToFollow = new TSM.vec3([0, 0, 0]);
    }
    Camera2D.prototype.update = function (dt) {
        this.followDistance += 1 * dt;
        this.followBack = Math.cos(this.cameraAngle * Util.deg2Rad) * this.followDistance;
        this.followHeight = Math.sin(this.cameraAngle * Util.deg2Rad) * this.followDistance;

        if (this.gameObjectToFollow != null) {
            this.positionToFollow.xy = this.gameObjectToFollow.position.xy;
        }
        this.lookAt.x = this.positionToFollow.x;
        this.lookAt.y = this.positionToFollow.y - 0.01;
        this.position.x = this.positionToFollow.x;
        this.position.y = this.positionToFollow.y + this.followBack;
        this.position.z = -this.followHeight;
    };

    Camera2D.prototype.follow = function (go) {
        this.gameObjectToFollow = go;
        this.followOffset = new TSM.vec2([
            (-game.terrain.worldWidth / 2) + go.sprite.width / 2,
            (-game.terrain.worldHeight / 2) + go.sprite.height / 2 + 3]);
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
