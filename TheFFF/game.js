/// <reference path="WebGL.d.ts" />
var Game = (function () {
    function Game(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl", { alpha: false });
        this.camera = new Camera2D();
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.input = new Input();
        document.onkeydown = function (event) {
            return _this.input.onKeyDown(event);
        };
        document.onkeyup = function (event) {
            return _this.input.onKeyUp(event);
        };
        document.onmousedown = function (event) {
            return _this.input.onMouseDown(event);
        };
        document.onmouseup = function (event) {
            return _this.input.onMouseUp(event);
        };
        document.onmousemove = function (event) {
            return _this.input.onMouseMove(event);
        };
    }
    Game.prototype.initialize = function () {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.textures = new TextureManager();
        this.textures.loadTexture("smile", "assets/smile.png");
        this.textures.loadTexture("dirt0", "assets/dirt0.png");
        this.textures.loadTexture("dirt1", "assets/dirt1.png");
        this.textures.loadTexture("grass0", "assets/grass0.png");
        this.textures.loadTexture("grass1", "assets/grass1.png");
        this.textures.loadTexture("grass2", "assets/grass2.png");
        this.textures.loadTexture("mtn0", "assets/mtn0.png");
        this.textures.loadTexture("water0", "assets/water0.png");
        this.textures.loadTexture("water1", "assets/water1.png");
        this.textures.loadTexture("mageIdle00", "assets/mageWalk00.png");
        this.textures.loadTexture("mageIdle01", "assets/mageWalk01.png");
        this.textures.loadTexture("mageIdle02", "assets/mageWalk02.png");
        this.textures.loadTexture("mageIdle03", "assets/mageWalk03.png");
        this.textures.loadTexture("mageWalk00", "assets/mageWalk00.png");
        this.textures.loadTexture("mageWalk01", "assets/mageWalk01.png");
        this.textures.loadTexture("mageWalk02", "assets/mageWalk02.png");
        this.textures.loadTexture("mageWalk03", "assets/mageWalk03.png");
        this.textures.loadTexture("mageAttack00", "assets/mageAttack00.png");
        this.textures.loadTexture("mageAttack01", "assets/mageAttack01.png");
        this.textures.loadTexture("mageAttack02", "assets/mageAttack02.png");
        this.textures.loadTexture("mageAttack03", "assets/mageAttack03.png");
        this.textures.loadTexture("mageAttack04", "assets/mageAttack04.png");
        this.textures.loadTexture("mageAttack05", "assets/mageAttack05.png");
        this.textures.loadTexture("mageAttack06", "assets/mageAttack06.png");
        this.textures.loadTexture("mageAttack07", "assets/mageAttack07.png");

        this.spriteShader = new SpriteShader();
        this.spriteShader.initialize();
        this.spriteShader.initLocales();

        this.terrain = new WorldTerrain();

        this.gameObjects = new GameObjectManager();
        var go = this.gameObjects.add(new GameObject("mageIdle00"));
        go.addAnimation("Idle", "mageIdle", 4);
        go.addAnimation("Walk", "mageWalk", 4, [0.1, 0.1, 0.1, 0.1]);
        go.addAnimation("Attack", "mageAttack", 7, [0.5, 0, 0.1, 0.5, 0, 0, 0.5, 0.1]);
        go.setActiveAnimation("Idle");
        go.sprite.alpha = true;
        this.playerController = new LocalPlayerController(go);
        this.camera.gameObjectToFollow = go;
    };

    Game.prototype.update = function (dt) {
        this.input.update();

        this.gameObjects.update(dt);

        this.camera.update();
        this.terrain.update();
    };

    Game.prototype.render = function () {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.terrain.render();
        this.gameObjects.render();
    };
    return Game;
})();
//# sourceMappingURL=game.js.map
