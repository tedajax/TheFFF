/// <reference path="tsm-0.7.d.ts" />

class Camera2D {
    position: TSM.vec3;
    lookAt: TSM.vec3;
    up: TSM.vec3;
    followOffset: TSM.vec2;
    gameObjectToFollow: GameObject;

    constructor() {
        this.position = new TSM.vec3([0, 0, -250]);
        this.lookAt = new TSM.vec3([0, 0, 0]);
        this.up = new TSM.vec3([0, 0, -1]);
    }

    update(dt: number) {
        if (this.gameObjectToFollow != null) {
            var position2D = TSM.vec2.sum(this.gameObjectToFollow.position, this.followOffset);
            this.position.x = position2D.x;
            this.position.y = position2D.y;
        }
        this.lookAt.x = this.position.x;
        this.lookAt.y = this.position.y - 250;
    }

    follow(go: GameObject) {
        this.gameObjectToFollow = go;
        this.followOffset = new TSM.vec2([(-game.width / 2) + go.sprite.width / 2, (-game.height / 2) + go.sprite.height / 2]);
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