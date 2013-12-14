/// <reference path="WebGL.d.ts" />
/// <reference path="TSM/tsm.ts" />

class RenderBuffer {
    glBuffer: WebGLBuffer;
    count: number;
    itemSize: number;
}

class Renderable {
    vertices: number[];
    indices: number[];
    colors: number[];
    texCoords: number[];

    vertexBuffer: RenderBuffer;
    indexBuffer: RenderBuffer;
    colorBuffer: RenderBuffer;
    texCoordBuffer: RenderBuffer;

    hidden: boolean;

    shader: Shader;
    position: TSM.vec2;
    scale: TSM.vec2;

    constructor() {
        this.position = TSM.vec2.zero;
        this.scale = new TSM.vec2([1, 1]);
    }

    setShader(shader: Shader) {
        this.shader = shader;
    }

    createBuffers() {
        this.vertexBuffer = this.createBuffer(this.vertices, game.gl.ARRAY_BUFFER, game.gl.STATIC_DRAW, 3);
        this.colorBuffer = this.createBuffer(this.colors, game.gl.ARRAY_BUFFER, game.gl.STATIC_DRAW, 4);
        this.texCoordBuffer = this.createBuffer(this.texCoords, game.gl.ARRAY_BUFFER, game.gl.STATIC_DRAW, 2);
        this.indexBuffer = this.createBuffer(this.indices, game.gl.ELEMENT_ARRAY_BUFFER, game.gl.STATIC_DRAW, 1);
    }

    createBuffer(data: number[], bufferType: number, drawMode: number, itemSize: number): RenderBuffer {
        var newGLBuffer = game.gl.createBuffer();
        game.gl.bindBuffer(bufferType, newGLBuffer);
        game.gl.bufferData(bufferType,
            (bufferType === game.gl.ARRAY_BUFFER) ? new Float32Array(data) : new Uint16Array(data),
            drawMode);

        var newBuffer = new RenderBuffer();
        newBuffer.glBuffer = newGLBuffer;
        newBuffer.itemSize = itemSize;
        newBuffer.count = data.length / itemSize;
        return newBuffer;
    }

    hide() {
        this.hidden = true;
    }

    show() {
        this.hidden = false;
    }

    requestRender() {
        if (!this.hidden) {
            render();
        }
    }

    render() {
    }

    buildWorldMatrix() {
        var scale = new TSM.mat4().setIdentity();
        scale.scale(new TSM.vec3([this.scale.x, this.scale.y, 1]));
        console.log(scale.at(0));
        var translation = new TSM.mat4().setIdentity();
        translation.translate(new TSM.vec3([this.position.x, this.position.y, 0]));

        return translation.multiply(scale);
    }
} 