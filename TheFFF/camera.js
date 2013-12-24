/// <reference path="tsm-0.7.d.ts" />
var Camera2D = (function () {
    function Camera2D() {
        this.position = new TSM.vec3([0, 0, 0]);
        this.lookAt = new TSM.vec3([0, 0, 0]);
        this.up = new TSM.vec3([0, 0, -1]);
        this.positionOffset = new TSM.vec3([0, 0, 0]);

        this.cameraAngle = 30;
        this.yRotation = 0;
        this.followDistance = 3;

        this.positionToFollow = new TSM.vec3([0, 0, 0]);

        this.cameraMode = "normal";
    }
    Camera2D.prototype.update = function (dt) {
        //if (game.input.getKey(Keys.I)) {
        //    this.followDistance -= 1 * dt;
        //    this.followDistance = Math.max(this.followDistance, 0);
        //}
        //if (game.input.getKey(Keys.K)) {
        //    this.followDistance += 1 * dt;
        //    this.followDistance = Math.min(this.followDistance, 30);
        //}
        //if (game.input.getKey(Keys.J)) {
        //    this.cameraAngle += 10 * dt;
        //    this.cameraAngle = Math.min(this.cameraAngle, 90);
        //}
        //if (game.input.getKey(Keys.L)) {
        //    this.cameraAngle -= 10 * dt;
        //    this.cameraAngle = Math.max(this.cameraAngle, 0);
        //}
        //if (game.input.getKey(Keys.O)) {
        //    this.positionOffset.z -= 5 * dt;
        //}
        this.followBack = Math.cos(this.cameraAngle * Util.deg2Rad) * this.followDistance;
        this.followHeight = Math.sin(this.cameraAngle * Util.deg2Rad) * this.followDistance;

        if (this.gameObjectToFollow != null) {
            this.positionToFollow.xyz = this.gameObjectToFollow.position.xyz;
        }
        this.lookAt.x = this.positionToFollow.x;
        this.lookAt.y = this.positionToFollow.y - 0.01;
        this.lookAt.z = this.positionToFollow.z;

        if (this.cameraMode == "normal") {
            this.position.x = this.positionToFollow.x + this.positionOffset.x;
            this.position.y = this.positionToFollow.y + this.followBack + this.positionOffset.y;
            this.position.z = -this.followHeight + this.positionOffset.z + this.positionToFollow.z;
        } else {
            this.position.x = this.positionToFollow.x + 5;
            this.position.y = this.positionToFollow.y;
            this.position.z = this.positionOffset.z + this.positionToFollow.z - 3;
        }
    };

    Camera2D.prototype.follow = function (go) {
        this.gameObjectToFollow = go;
        this.followOffset = new TSM.vec2([
            (-game.terrain.worldWidth / 2) + go.sprite.width / 2,
            (-game.terrain.worldHeight / 2) + go.sprite.height / 2 + 3]);
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

    Camera2D.prototype.inRenderRange = function (position) {
        return !(position.y < game.camera.position.y - 20 || position.y > game.camera.position.y + 2 || position.x > game.camera.position.x + 18 || position.x < game.camera.position.x - 18);
    };
    return Camera2D;
})();
//# sourceMappingURL=camera.js.map
