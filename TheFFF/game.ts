/// <reference path="WebGL.d.ts" />

class Game {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    camera: Camera2D;
    input: Input;
    width: number;
    height: number;

    textures: TextureManager;
    terrain: WorldTerrain;
    gameObjects: GameObjectManager;
    playerController: LocalPlayerController;

    spriteShader: SpriteShader;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl", { alpha: false });
        this.camera = new Camera2D();
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.input = new Input();
        document.onkeydown = (event: KeyboardEvent) => this.input.onKeyDown(event);
        document.onkeyup = (event: KeyboardEvent) => this.input.onKeyUp(event);
        document.onmousedown = (event: MouseEvent) => this.input.onMouseDown(event);
        document.onmouseup = (event: MouseEvent) => this.input.onMouseUp(event);
        document.onmousemove = (event: MouseEvent) => this.input.onMouseMove(event);
    }

    initialize() {
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

        this.spriteShader = new SpriteShader();
        this.spriteShader.initialize();
        this.spriteShader.initLocales();

        this.terrain = new WorldTerrain();

        this.gameObjects = new GameObjectManager();
        var go = this.gameObjects.add(new GameObject("smile"));
        this.playerController = new LocalPlayerController(go);
        this.camera.gameObjectToFollow = go;
    }

    update(dt: number) {
        this.input.update();

        this.gameObjects.update(dt);

        this.camera.update();
        this.terrain.update();
    }

    render() {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.terrain.render();
        this.gameObjects.render();
    }
}
