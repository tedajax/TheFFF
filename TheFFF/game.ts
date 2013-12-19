/// <reference path="WebGL.d.ts" />

class Game {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    camera: Camera2D;
    input: Input;
    width: number;
    height: number;
    frame: number;
    config: Object;

    localPlayerId: number;
    localEntityId: number;
    localPlayerUpdateInterval: number;
    localPlayerUpdateTimer: number;

    textures: TextureManager;
    terrain: WorldTerrain;
    gameObjects: GameObjectManager;
    playerController: LocalPlayerController;
    animationFactory: AnimationFactory;

    spriteShader: SpriteShader;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl", { alpha: false });
        this.camera = new Camera2D();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.frame = 0;

        this.input = new Input();
        document.onkeydown = (event: KeyboardEvent) => this.input.onKeyDown(event);
        document.onkeyup = (event: KeyboardEvent) => this.input.onKeyUp(event);
        document.onmousedown = (event: MouseEvent) => this.input.onMouseDown(event);
        document.onmouseup = (event: MouseEvent) => this.input.onMouseUp(event);
        document.onmousemove = (event: MouseEvent) => this.input.onMouseMove(event);

        this.localPlayerId = -1;
        this.localEntityId = -1;
        this.localPlayerUpdateInterval = 0.05;
        this.localPlayerUpdateTimer = 0;
    }

    initialize() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.config = loadJsonFile("config.json")["game_config"];

        this.initializeTextures();
        this.initializeAnimations();
        
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
    }

    render() {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.terrain.render();
        this.gameObjects.render();
        ++this.frame;
    }

    updateLocalPlayer() {
        if (this.localEntityId >= 0 && this.playerController.gameObject == null) {
            if (this.gameObjects.gameObjects[this.localEntityId] != null) {
                this.playerController.posess(this.gameObjects.gameObjects[this.localEntityId]);
                this.camera.follow(this.gameObjects.gameObjects[this.localEntityId]);
            }    
        }
    }
}
