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

        this.mesh = game.meshFactory.createQuad(width, height);

        this.alpha = false;

        this.width = width;
        this.height = height;

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
        spriteShader.objectDrawSetup();
        if (this.bindTexture) {
            spriteShader.texture = this.texture;
            spriteShader.bindTexture();
        }

        game.renderer.setAlpha(this.alpha);

        this.mesh.render(this.shader);
    }
} 