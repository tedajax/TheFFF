class Quad extends Renderable {
    texture: ImageTexture;

    constructor() {
        super();
        this.buildMesh();
    }

    buildMesh() {
        this.vertices = [
             0,  0, 0,
             0, 64, 0,
            64, 64, 0,
            64,  0, 0
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
    }

    setTexture(texture: ImageTexture) {
        this.texture = texture;
    }

    render() {
        game.gl.useProgram(this.shader.program);

        var spriteShader = <SpriteShader>this.shader;
        spriteShader.worldMatrix = this.buildWorldMatrix();
        spriteShader.texture = this.texture;
        spriteShader.objectDrawSetup();

        game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.vertexBuffer.glBuffer);
        game.gl.vertexAttribPointer(this.shader.attribs["position"],
            this.vertexBuffer.itemSize,
            game.gl.FLOAT,
            false,
            0, 0);

        game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.texCoordBuffer.glBuffer);
        game.gl.vertexAttribPointer(this.shader.attribs["uv"],
            this.texCoordBuffer.itemSize,
            game.gl.FLOAT,
            false,
            0, 0);

        game.gl.bindBuffer(game.gl.ARRAY_BUFFER, this.colorBuffer.glBuffer);
        game.gl.vertexAttribPointer(this.shader.attribs["color"],
            this.colorBuffer.itemSize,
            game.gl.FLOAT,
            false,
            0, 0);

        game.gl.bindBuffer(game.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.glBuffer);
        game.gl.drawElements(game.gl.TRIANGLES, this.indexBuffer.count, game.gl.UNSIGNED_SHORT, 0);
    }
} 