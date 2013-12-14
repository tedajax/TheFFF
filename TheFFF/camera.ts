/// <reference path="TSM/tsm.ts" />

class Camera2D {
    position: TSM.vec2;

    constructor() {
        this.position = new TSM.vec2([0, 0]);
    }

    move(velocity: TSM.vec2) {
        this.position.subtract(velocity);
    }

    getProjectionMatrix() {
        return TSM.mat4.orthographic(0, 960, 480, 0, 0, 1);
    }

    getViewMatrix() {
        return TSM.mat4.lookAt(new TSM.vec3([0, 0, 0]),
            new TSM.vec3([0, 0, -1]),
            new TSM.vec3([0, 1, 0]));
    }
} 