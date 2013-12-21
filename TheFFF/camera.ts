/// <reference path="tsm-0.7.d.ts" />

class Camera2D {
    position: TSM.vec3;
    lookAt: TSM.vec3;
    up: TSM.vec3;
    followOffset: TSM.vec2;
    gameObjectToFollow: GameObject;
    positionToFollow: TSM.vec3;

    followHeight: number;
    followBack: number;
    cameraAngle: number;
    followDistance: number;

    constructor() {
        this.position = new TSM.vec3([0, 0, 0]);
        this.lookAt = new TSM.vec3([0, 0, 0]);
        this.up = new TSM.vec3([0, 0, -1]);

        this.cameraAngle = 45;
        this.followDistance = Math.sqrt(8);

        this.positionToFollow = new TSM.vec3([0, 0, 0]);
    }

    update(dt: number) {
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
    }

    follow(go: GameObject) {
        this.gameObjectToFollow = go;
        this.followOffset = new TSM.vec2([(-game.terrain.worldWidth / 2) + go.sprite.width / 2,
                                          (-game.terrain.worldHeight / 2) + go.sprite.height / 2 + 3]);
    }

    move(velocity: TSM.vec2) {
        this.position.x -= velocity.x;
        this.position.y -= velocity.y;
    }

    getProjectionMatrix() {
        var aspect = game.width / game.height;
        return TSM.mat4.perspective(90, game.width / game.height, 0.1, 1000);
        //return TSM.mat4.orthographic(0 + this.position.x, game.width + this.position.x, game.height + this.position.y, 0 + this.position.y, 0, 1);
        //return TSM.mat4.orthographic(0, game.width, game.height, 0, 0, 100);
    }

    getViewMatrix() {
        return TSM.mat4.lookAt(this.position,
            this.lookAt,
            this.up);
    }
} 