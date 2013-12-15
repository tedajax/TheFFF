class GameObject {
    sprite: Quad;
    position: TSM.vec2;
    controller: Controller;

    constructor(textureName: string) {
        this.sprite = new Quad();
        this.sprite.setShader(game.spriteShader);
        this.sprite.setTexture(game.textures.getTexture(textureName));
        this.position = new TSM.vec2([0, 0]);
    }    

    setController(controller: Controller) {
        this.controller = controller;
    }

    update(dt: number) {
        if (this.controller != null) {
            this.controller.update(dt);
        }

        this.sprite.position = this.position;
    }

    render() {
        this.sprite.render();
    }
} 