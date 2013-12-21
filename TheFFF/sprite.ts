class Sprite extends Renderable {
    texture: ImageTexture;
    alpha: boolean;
    width: number;
    height: number;
    bindTexture: boolean;

    static defaultWidth: number = 1;
    static defaultHeight: number = 1;

    constructor(width: number = Sprite.defaultWidth, height: number = Sprite.defaultHeight) {
        super();

        this.mesh = game.meshFactory.createQuad(1, 1);

        this.alpha = false;

        this.width = width;
        this.height = height;

        this.scale.x = this.width;
        this.scale.y = this.height

        this.origin = new TSM.vec2([this.width / 2, this.height / 2]);

        this.bindTexture = true;
    }

    setTexture(texture: ImageTexture) {
        this.texture = texture;
    }

    setBindTexture(bind: boolean) {
        this.bindTexture = bind;
    }

    render() {
        var spriteShader = <SpriteShader>this.shader;
        spriteShader.worldMatrix = this.buildWorldMatrix();
        if (game.renderedFrames % 600 == 0) {
            console.log(spriteShader.worldMatrix);
        }
        spriteShader.objectDrawSetup();
        if (this.bindTexture) {
            spriteShader.texture = this.texture;
            spriteShader.bindTexture();
        }

        game.renderer.setAlpha(this.alpha);

        this.mesh.render(this.shader);
    }
} 