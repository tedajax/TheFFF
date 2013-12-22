/// <reference path="tsm-0.7.d.ts" />

class Camera2D {
    position: TSM.vec3;
    lookAt: TSM.vec3;
    up: TSM.vec3;
    followOffset: TSM.vec2;
    gameObjectToFollow: GameObject;
    positionToFollow: TSM.vec3;
    positionOffset: TSM.vec3;

    followHeight: number;
    followBack: number;
    cameraAngle: number;
    yRotation: number;
    followDistance: number;

    //for fancy elliptical terrain drawing
    terrainEllipseDepth: number;
    terrainEllipseHeight: number;
    terrainReferencePoint: number;
    terrainFollowCam: boolean;

    displayedInfo: boolean;

    constructor() {
        this.position = new TSM.vec3([0, 0, 0]);
        this.lookAt = new TSM.vec3([0, 0, 0]);
        this.up = new TSM.vec3([0, 0, -1]);
        this.positionOffset = new TSM.vec3([0, 0, 0]);

        this.cameraAngle = 45;
        this.yRotation = 0;
        this.followDistance = 6;

        this.positionToFollow = new TSM.vec3([0, 0, 0]);

        this.terrainEllipseDepth = 40;
        this.terrainEllipseHeight = 3;
        this.terrainFollowCam = true;
    }

    update(dt: number) {
        if (game.input.getKey(Keys.I)) {
            this.followDistance -= 1 * dt;
            this.followDistance = Math.max(this.followDistance, 0);
        }
        if (game.input.getKey(Keys.K)) {
            this.followDistance += 1 * dt;
            this.followDistance = Math.min(this.followDistance, 30);
        }
        if (game.input.getKey(Keys.J)) {
            this.cameraAngle += 10 * dt;
            this.cameraAngle = Math.min(this.cameraAngle, 90);
        }
        if (game.input.getKey(Keys.L)) {
            this.cameraAngle -= 10 * dt;
            this.cameraAngle = Math.max(this.cameraAngle, 0);
        }
        if (game.input.getKey(Keys.O)) {
            this.positionOffset.z -= 5 * dt;
        }
         
        if (game.input.getKeyDown(Keys.SPACE)) {
            this.terrainFollowCam = !this.terrainFollowCam;
            console.log(this.terrainFollowCam);
        }

        if (this.terrainFollowCam) {
            this.terrainReferencePoint = this.position.y + 1;
        }

        this.followBack = Math.cos(this.cameraAngle * Util.deg2Rad) * this.followDistance;
        this.followHeight = Math.sin(this.cameraAngle * Util.deg2Rad) * this.followDistance;

        if (this.gameObjectToFollow != null) {
            this.positionToFollow.xyz = this.gameObjectToFollow.position.xyz;
        }
        this.lookAt.x = this.positionToFollow.x;
        this.lookAt.y = this.positionToFollow.y - 0.01;
        this.lookAt.z = this.positionToFollow.z;
        this.position.x = this.positionToFollow.x + this.positionOffset.x;
        this.position.y = this.positionToFollow.y + this.followBack + this.positionOffset.y;
        this.position.z = -this.followHeight + this.positionOffset.z + this.positionToFollow.z;
    }

    getPropHeight(position: TSM.vec2): number {
        return 0;
    }

    getTerrainRotation(position: TSM.vec2): number {
        return 0;
    }

    getTerrainHeight(position: TSM.vec3, offset: number): number {
        var b = this.terrainEllipseDepth / 2;
        var a = this.terrainEllipseHeight;
        var c = this.terrainReferencePoint - b;
        var diff = c - (position.y + offset);
        var diffsqr = Math.pow(diff, 2);
        if (Math.abs(diff) > b) {
            return 0;
        }
        var asqr = Math.pow(a, 2);
        var bsqr = Math.pow(b, 2);
        var result = Math.max(Math.sqrt(((-asqr * diffsqr) / bsqr) + asqr), 0);

        return -result;
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