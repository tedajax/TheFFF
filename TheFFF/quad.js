var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Quad = (function (_super) {
    __extends(Quad, _super);
    function Quad() {
        _super.call(this);
        this.buildMesh();
    }
    Quad.prototype.buildMesh = function () {
        this.vertices = [
            0, 0, 0,
            0, 64, 0,
            64, 64, 0,
            64, 0, 0
        ];

        this.colors = [
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1
        ];

        this.texCoords = [
            0, 0,
            0, 1,
            1, 1,
            1, 0
        ];

        this.indices = [
            0, 2, 1,
            0, 3, 2
        ];

        this.createBuffers();
    };

    Quad.prototype.setTexture = function (texture) {
        this.texture = texture;
    };

    Quad.prototype.render = function () {
        game.gl.useProgram(this.shader.program);

        var spriteShader = this.shader;
        spriteShader.worldMatrix = this.buildWorldMatrix();
        spriteShader.texture = this.texture;
        spriteShader.objectDrawSetup();

        game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.vertexBuffer.glBuffer);
        game.gl.vertexAttribPointer(this.shader.attribs["position"], this.vertexBuffer.itemSize, game.gl.FLOAT, false, 0, 0);

        game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.texCoordBuffer.glBuffer);
        game.gl.vertexAttribPointer(this.shader.attribs["uv"], this.texCoordBuffer.itemSize, game.gl.FLOAT, false, 0, 0);

        game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.colorBuffer.glBuffer);
        game.gl.vertexAttribPointer(this.shader.attribs["color"], this.colorBuffer.itemSize, game.gl.FLOAT, false, 0, 0);

        game.gl.bindBuffer(game.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.glBuffer);
        game.gl.drawElements(game.gl.TRIANGLES, this.indexBuffer.count, game.gl.UNSIGNED_SHORT, 0);
    };
    return Quad;
})(Renderable);
//# sourceMappingURL=quad.js.map
