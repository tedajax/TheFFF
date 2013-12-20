class Quad extends Renderable {
    texture: ImageTexture;
    alpha: boolean;
    width: number;
    height: number;
    bindTexture: boolean;

    static defaultWidth: number = 1;
    static defaultHeight: number = 1;

    constructor(depth: number = 0, width: number = Quad.defaultWidth, height: number = Quad.defaultHeight) {
        super(depth);

        this.alpha = false;

        this.width = width;
        this.height = height;

        this.bindTexture = true;

        this.buildMesh();
    }

    buildMesh() {
        this.vertices = [
            0,          0,           0,
            0,          this.height, 0,
            this.width, this.height, 0,
            this.width, 0,           0
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

    setBindTexture(bind: boolean) {
        this.bindTexture = bind;
    }

    render() {
        game.gl.useProgram(this.shader.program);

        var spriteShader = <SpriteShader>this.shader;
        spriteShader.worldMatrix = this.buildWorldMatrix();
        spriteShader.objectDrawSetup();
        if (this.bindTexture) {
            spriteShader.texture = this.texture;
            spriteShader.bindTexture();
        }

        if (this.alpha) {
            game.gl.blendFunc(game.gl.SRC_ALPHA, game.gl.ONE_MINUS_SRC_ALPHA);
            game.gl.enable(game.gl.BLEND);
        }

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