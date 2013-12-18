/// <reference path="TSM/tsm.ts" />

class Camera2D {
    position: TSM.vec2;
    followOffset: TSM.vec2;
    gameObjectToFollow: GameObject;

    constructor() {
        this.position = new TSM.vec2([0, 0]);
    }

    update() {
        if (this.gameObjectToFollow != null) {
            this.position = TSM.vec2.sum(this.gameObjectToFollow.position, this.followOffset);
        }
    }

    follow(go: GameObject) {
        this.gameObjectToFollow = go;
        this.followOffset = new TSM.vec2([(-game.width / 2) + go.sprite.width / 2, (-game.height / 2) + go.sprite.height / 2]);
    }

    move(velocity: TSM.vec2) {
        this.position.subtract(velocity);
    }

    getProjectionMatrix() {
        return TSM.mat4.orthographic(0 + this.position.x, game.width + this.position.x, game.height + this.position.y, 0 + this.position.y, 0, 1);
    }

    getViewMatrix() {
        return TSM.mat4.lookAt(new TSM.vec3([0, 0, 0]),
            new TSM.vec3([0, 0, -1]),
            new TSM.vec3([0, 1, 0]));
    }
} 