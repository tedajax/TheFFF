/// <reference path="WebGL.d.ts" />
var Game = (function () {
    function Game(canvas) {
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl", { alpha: false });
        this.camera = new Camera2D();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    Game.prototype.initialize = function () {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.spriteShader = new SpriteShader();
        this.spriteShader.initialize();
        this.spriteShader.initLocales();

        this.test = new Quad();
        this.test.setShader(this.spriteShader);
        this.test.position = new TSM.vec2([200, 200]);
    };

    Game.prototype.update = function (dt) {
        this.test.scale.x += 0.1 * dt;
    };

    Game.prototype.render = function () {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.test.render();
    };
    return Game;
})();
//# sourceMappingURL=game.js.map
