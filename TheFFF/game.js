/// <reference path="WebGL.d.ts" />
var Game = (function () {
    function Game(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl", { alpha: false });
        this.camera = new Camera2D();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.renderedFrames = 0;
        this.simulationTicks = 0;
        this.elapsedTime = 0;

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
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

        this.config = loadJsonFile("config.json")["game_config"];

        this.renderer = new RenderManager();

        this.initializeTextures();
        this.initializeAnimations();

        this.meshFactory = new MeshFactory();

        this.spriteShader = new SpriteShader();
        this.spriteShader.initialize();
        this.spriteShader.initLocales();

        this.terrain = new WorldTerrain();

        this.gameObjects = new GameObjectManager();

        //var go = this.gameObjects.add(new GameObject("mageIdle00"), 0);
        //go.addAnimation("Idle", "mageIdle", 4);
        //go.addAnimation("Walk", "mageWalk", 4, true, [0.1, 0.1, 0.1, 0.1]);
        //go.addAnimation("Attack", "mageAttack", 8, false, [0.5, 0, 0.1, 0.5, 0, 0, 0.5, 0.1]);
        //go.setActiveAnimation("Idle");
        //go.sprite.alpha = true;
        this.playerController = new LocalPlayerController(null);
    };

    Game.prototype.initializeTextures = function () {
        this.textures = new TextureManager();
        var resourceMap = this.config["resource_map"];
        for (var key in resourceMap) {
            var value = resourceMap[key];
            this.textures.loadTexture(key, value);
        }
    };

    Game.prototype.initializeAnimations = function () {
        this.animationFactory = new AnimationFactory();

        this.animationFactory.createAnimation("mage", "idle", "mageIdle", 4);
        this.animationFactory.createAnimation("mage", "walk", "mageWalk", 4, [0.1, 0.1, 0.1, 0.1], 1);
        this.animationFactory.createAnimation("mage", "attack", "mageAttack", 8, [0.5, 0, 0.1, 0.5, 0, 0, 0.5, 0.1], 2);
    };

    Game.prototype.update = function (dt) {
        this.updateLocalPlayer();

        this.gameObjects.update(dt);

        this.camera.update(dt);
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

        if (this.input.getKeyDown(Keys.F)) {
            this.spriteShader.fogEnabled = !this.spriteShader.fogEnabled;
        }

        this.input.update();

        ++this.simulationTicks;
        this.elapsedTime += dt;
    };

    Game.prototype.render = function () {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.terrain.render();
        this.gameObjects.render();
        ++this.renderedFrames;
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
