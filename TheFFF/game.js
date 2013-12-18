/// <reference path="WebGL.d.ts" />
var Game = (function () {
    function Game(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl", { alpha: false });
        this.camera = new Camera2D();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.frame = 0;

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

        this.localPlayerId = -1;
        this.localEntityId = -1;
        this.localPlayerUpdateInterval = 0.05;
        this.localPlayerUpdateTimer = 0;
    }
    Game.prototype.initialize = function () {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.config = loadJsonFile("config.json")["game_config"];

        this.textures = new TextureManager();
        this.textures.loadTexture("dirt0", "assets/tiles/dirt0.png");
        this.textures.loadTexture("dirt1", "assets/tiles/dirt1.png");
        this.textures.loadTexture("grass0", "assets/tiles/grass0.png");
        this.textures.loadTexture("grass1", "assets/tiles/grass1.png");
        this.textures.loadTexture("grass2", "assets/tiles/grass2.png");
        this.textures.loadTexture("mtn0", "assets/tiles/mtn0.png");
        this.textures.loadTexture("water0", "assets/tiles/water0.png");
        this.textures.loadTexture("water1", "assets/tiles/water1.png");
        this.textures.loadTexture("mageIdle00", "assets/magus/mageWalk00.png");
        this.textures.loadTexture("mageIdle01", "assets/magus/mageWalk01.png");
        this.textures.loadTexture("mageIdle02", "assets/magus/mageWalk02.png");
        this.textures.loadTexture("mageIdle03", "assets/magus/mageWalk03.png");
        this.textures.loadTexture("mageWalk00", "assets/magus/mageWalk00.png");
        this.textures.loadTexture("mageWalk01", "assets/magus/mageWalk01.png");
        this.textures.loadTexture("mageWalk02", "assets/magus/mageWalk02.png");
        this.textures.loadTexture("mageWalk03", "assets/magus/mageWalk03.png");
        this.textures.loadTexture("mageAttack00", "assets/magus/mageAttack00.png");
        this.textures.loadTexture("mageAttack01", "assets/magus/mageAttack01.png");
        this.textures.loadTexture("mageAttack02", "assets/magus/mageAttack02.png");
        this.textures.loadTexture("mageAttack03", "assets/magus/mageAttack03.png");
        this.textures.loadTexture("mageAttack04", "assets/magus/mageAttack04.png");
        this.textures.loadTexture("mageAttack05", "assets/magus/mageAttack05.png");
        this.textures.loadTexture("mageAttack06", "assets/magus/mageAttack06.png");
        this.textures.loadTexture("mageAttack07", "assets/magus/mageAttack07.png");

        this.animationFactory = new AnimationFactory();

        this.spriteShader = new SpriteShader();
        this.spriteShader.initialize();
        this.spriteShader.initLocales();

        this.terrain = new WorldTerrain();

        this.gameObjects = new GameObjectManager();

        //var go = this.gameObjects.add(new GameObject("mageIdle00"), 0);
        //go.addAnimation("Idle", "mageIdle", 4);
        //go.addAnimation("Walk", "mageWalk", 4, true, [0.1, 0.1, 0.1, 0.1]);
        //go.addAnimation("Attack", "mageAttack", 7, false, [0.5, 0, 0.1, 0.5, 0, 0, 0.5, 0.1]);
        //go.setActiveAnimation("Idle");
        //go.sprite.alpha = true;
        this.playerController = new LocalPlayerController(null);
    };

    Game.prototype.update = function (dt) {
        this.updateLocalPlayer();

        this.gameObjects.update(dt);

        this.camera.update();
        this.terrain.update();

        if (this.localEntityId >= 0) {
            this.localPlayerUpdateTimer += dt;
            if (this.localPlayerUpdateTimer >= this.localPlayerUpdateInterval) {
                this.localPlayerUpdateTimer = 0;
                var info = this.playerController.getStateSyncInfo();
                connection.sendCommands([
                    {
                        "type": 104,
                        "stateSync": {
                            "networkId": this.localEntityId,
                            "moveableState": info["moveableState"],
                            "transformState": null
                        }
                    }
                ]);
            }
        }

        this.input.update();
    };

    Game.prototype.render = function () {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.terrain.render();
        this.gameObjects.render();
        ++this.frame;
    };

    Game.prototype.updateLocalPlayer = function () {
        if (this.localEntityId >= 0 && this.playerController.gameObject == null) {
            if (this.gameObjects.gameObjects[this.localEntityId] != null) {
                this.playerController.posess(this.gameObjects.gameObjects[this.localEntityId]);
                this.camera.follow(this.gameObjects.gameObjects[this.localEntityId]);
            }
        }
    };
    return Game;
})();
//# sourceMappingURL=game.js.map
