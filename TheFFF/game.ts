/// <reference path="WebGL.d.ts" />

class Game {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    camera: Camera2D;
    input: Input;
    width: number;
    height: number;
    useFullWindow: boolean;
    fullscreen: boolean;
    simulationTicks: number;
    renderedFrames: number;
    elapsedTime: number;
    config: Object;

    localPlayerId: number;
    localEntityId: number;
    localPlayerUpdateInterval: number;
    localPlayerUpdateTimer: number;

    renderer: RenderManager;
    textures: TextureManager;
    terrain: WorldTerrain;
    worldObjects: WorldObjects;
    gameObjects: GameObjectManager;
    playerController: LocalPlayerController;
    animationFactory: AnimationFactory;
    meshFactory: MeshFactory;

    spriteShader: SpriteShader;

    constructor(canvas: HTMLCanvasElement) {
        this.useFullWindow = false;

        this.canvas = canvas;
        if (this.useFullWindow) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.fullscreen = false;

        this.gl = this.canvas.getContext("webgl", { alpha: true });
        this.gl.viewport(0, 0, this.width, this.height);

        this.camera = new Camera2D();
        this.renderedFrames = 0;
        this.simulationTicks = 0;
        this.elapsedTime = 0;

        this.input = new Input();
        document.onkeydown = (event: KeyboardEvent) => this.input.onKeyDown(event);
        document.onkeyup = (event: KeyboardEvent) => this.input.onKeyUp(event);
        document.onmousedown = (event: MouseEvent) => this.input.onMouseDown(event);
        document.onmouseup = (event: MouseEvent) => this.input.onMouseUp(event);
        document.onmousemove = (event: MouseEvent) => this.input.onMouseMove(event);
        window.onresize = () => this.onResize();

        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.keyCode == Keys.G) {
                ["requestFullscreen", "msRequestFullscreen", "webkitRequestFullscreen", "mozRequestFullscreen"].forEach((name: string) => {
                    if (this.canvas[name] != null) {
                        game.fullscreen = true;
                        this.canvas[name]();
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

    initialize() {
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
                
        //var go = this.gameObjects.add(new GameObject("mageIdle00"), 0);
        //go.addAnimation("Idle", "mageIdle", 4);
        //go.addAnimation("Walk", "mageWalk", 4, true, [0.1, 0.1, 0.1, 0.1]);
        //go.addAnimation("Attack", "mageAttack", 8, false, [0.5, 0, 0.1, 0.5, 0, 0, 0.5, 0.1]);
        //go.setActiveAnimation("Idle");
        //go.sprite.alpha = true;
        this.playerController = new LocalPlayerController(null);
    }

    initializeTextures() {
        this.textures = new TextureManager();
        var resourceMap = this.config["resource_map"];
        for (var key in resourceMap) {
            var value = resourceMap[key];
            this.textures.loadTexture(key, value);
        }
    }

    initializeAnimations() {
        this.animationFactory = new AnimationFactory();

        this.animationFactory.createAnimation("mage", "idle", "mageIdle", 4);
        this.animationFactory.createAnimation("mage", "walk", "mageWalk", 4, [0.1, 0.1, 0.1, 0.1], 1);
        this.animationFactory.createAnimation("mage", "attack", "mageAttack", 8, [0.5, 0, 0.1, 0.5, 0, 0, 0.5, 0.1], 2);
    }

    update(dt: number) {
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

        if (this.input.getKeyDown(Keys.F)) {
            this.spriteShader.fogEnabled = !this.spriteShader.fogEnabled;
        }

        this.input.update();

        ++this.simulationTicks;
        this.elapsedTime += dt;
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.terrain.render();
        //this.worldObjects.render();
        this.gameObjects.render();
        ++this.renderedFrames;
    }

    updateLocalPlayer() {
        if (this.localEntityId >= 0 && this.playerController.gameObject == null) {
            if (this.gameObjects.gameObjects[this.localEntityId] != null) {
                this.playerController.posess(this.gameObjects.gameObjects[this.localEntityId]);
                this.camera.follow(this.gameObjects.gameObjects[this.localEntityId]);
            }    
        }
    }

    onResize() {
        if (this.useFullWindow) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.width = this.canvas.width;
            this.height = this.canvas.height;

            this.gl.viewport(0, 0, this.width, this.height);
        }
    }
}
