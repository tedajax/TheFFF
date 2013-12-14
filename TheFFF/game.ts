/// <reference path="WebGL.d.ts" />

class Game {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    camera: Camera2D;
    width: number;
    height: number;

    test: Quad;
    spriteShader: SpriteShader;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = this.canvas.getContext("webgl", { alpha: false });
        this.camera = new Camera2D();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    initialize() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.spriteShader = new SpriteShader();
        this.spriteShader.initialize();
        this.spriteShader.initLocales();
        
        this.test = new Quad();
        this.test.setShader(this.spriteShader);
        this.test.position = new TSM.vec2([200, 200]);
    }

    update(dt: number) {
        
        this.test.scale.x += 0.1 * dt;
    }

    render() {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.spriteShader.frameDrawSetup();
        this.test.render();
    }
}
