var Game = /** @class */ (function () {
    function Game(canvas) {
        var _this = this;
        this.useFullWindow = true;
        this.canvas = canvas;
        if (this.useFullWindow) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.fullscreen = false;
        this.gl = this.canvas.getContext("webgl", { alpha: true });
        if (!this.gl) {
            console.log("reverting to experimental-webgl");
            this.gl = this.canvas.getContext("webgl", { alpha: true });
        }
        this.gl.viewport(0, 0, this.width, this.height);
        this.camera = new Camera2D();
        this.renderedFrames = 0;
        this.simulationTicks = 0;
        this.elapsedTime = 0;
        this.input = new Input();
        document.onkeydown = function (event) { return _this.input.onKeyDown(event); };
        document.onkeyup = function (event) { return _this.input.onKeyUp(event); };
        document.onmousedown = function (event) { return _this.input.onMouseDown(event); };
        document.onmouseup = function (event) { return _this.input.onMouseUp(event); };
        document.onmousemove = function (event) { return _this.input.onMouseMove(event); };
        window.onresize = function () { return _this.onResize(); };
        document.addEventListener("keydown", function (e) {
            if (e.keyCode == Keys.F) {
                ["requestFullscreen", "msRequestFullscreen", "webkitRequestFullscreen", "mozRequestFullscreen"].forEach(function (name) {
                    if (_this.canvas[name] != null) {
                        game.fullscreen = true;
                        _this.canvas[name]();
                        return false;
                    }
                });
            }
        });
        //var myFullscreenFuncs = ;
        //for (var f in myFullscreenFuncs) {
        //    if (this.canvas[f] != null) {
        //        console.log(myFullscreenFuncs[f]);
        //        this.canvas[myFullscreenFuncs[f]]();
        //        break;
        //    }
        //}
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
        this.worldObjects = new WorldObjects();
        this.localEntityId = 0;
        var go = game.gameObjects.add(new GameObject("mage", ["idle", "walk", "attack"]), this.localEntityId);
        go.animations.play("idle", true);
        go.sprite.alpha = true;
        this.playerController = new LocalPlayerController(go);
        this.camera.follow(go);
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
        //this.worldObjects.update(dt);
        if (this.input.getKey(Keys.Z)) {
            this.spriteShader.fogStart -= 1 * dt;
        }
        if (this.input.getKey(Keys.X)) {
            this.spriteShader.fogStart += 1 * dt;
        }
        if (this.input.getKey(Keys.C)) {
            this.spriteShader.fogEnd -= 1 * dt;
        }
        if (this.input.getKey(Keys.V)) {
            this.spriteShader.fogEnd += 1 * dt;
        }
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
        if (this.input.getKeyDown(Keys.G)) {
            this.spriteShader.fogEnabled = !this.spriteShader.fogEnabled;
        }
        this.input.update();
        ++this.simulationTicks;
        this.elapsedTime += dt;
    };
    Game.prototype.render = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.terrain.render();
        //this.worldObjects.render();
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
    Game.prototype.onResize = function () {
        if (this.useFullWindow) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.gl.viewport(0, 0, this.width, this.height);
        }
    };
    return Game;
}());
//# sourceMappingURL=game.js.map