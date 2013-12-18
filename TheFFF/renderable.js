/// <reference path="WebGL.d.ts" />
/// <reference path="TSM/tsm.ts" />
var RenderBuffer = (function () {
    function RenderBuffer() {
    }
    return RenderBuffer;
})();

var Renderable = (function () {
    function Renderable(depth) {
        if (typeof depth === "undefined") { depth = 0; }
        this.position = TSM.vec2.zero;
        this.scale = new TSM.vec2([1, 1]);
        this.depth = depth;
    }
    Renderable.prototype.setShader = function (shader) {
        this.shader = shader;
    };

    Renderable.prototype.createBuffers = function () {
        this.vertexBuffer = this.createBuffer(this.vertices, game.gl.ARRAY_BUFFER, game.gl.STATIC_DRAW, 3);
        this.colorBuffer = this.createBuffer(this.colors, game.gl.ARRAY_BUFFER, game.gl.STATIC_DRAW, 4);
        this.texCoordBuffer = this.createBuffer(this.texCoords, game.gl.ARRAY_BUFFER, game.gl.STATIC_DRAW, 2);
        this.indexBuffer = this.createBuffer(this.indices, game.gl.ELEMENT_ARRAY_BUFFER, game.gl.STATIC_DRAW, 1);
    };

    Renderable.prototype.createBuffer = function (data, bufferType, drawMode, itemSize) {
        var newGLBuffer = game.gl.createBuffer();
        game.gl.bindBuffer(bufferType, newGLBuffer);
        game.gl.bufferData(bufferType, (bufferType === game.gl.ARRAY_BUFFER) ? new Float32Array(data) : new Uint16Array(data), drawMode);

        var newBuffer = new RenderBuffer();
        newBuffer.glBuffer = newGLBuffer;
        newBuffer.itemSize = itemSize;
        newBuffer.count = data.length / itemSize;
        return newBuffer;
    };

    Renderable.prototype.hide = function () {
        this.hidden = true;
    };

    Renderable.prototype.show = function () {
        this.hidden = false;
    };

    Renderable.prototype.requestRender = function () {
        if (!this.hidden) {
            render();
        }
    };

    Renderable.prototype.render = function () {
    };

    Renderable.prototype.buildWorldMatrix = function () {
        var scale = new TSM.mat4().setIdentity();
        scale.scale(new TSM.vec3([this.scale.x, this.scale.y, 1]));
        var translation = new TSM.mat4().setIdentity();
        translation.translate(new TSM.vec3([this.position.x, this.position.y, this.depth]));

        return translation.multiply(scale);
    };
    return Renderable;
})();
//# sourceMappingURL=renderable.js.map
