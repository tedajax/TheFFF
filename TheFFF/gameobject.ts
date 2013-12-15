class GameObject {
    sprite: Quad;
    position: TSM.vec2;
    controller: Controller;
    animations: Animation[];
    activeAnimation: string;

    constructor(textureName: string) {
        this.sprite = new Quad();
        this.sprite.setShader(game.spriteShader);
        this.sprite.setTexture(game.textures.getTexture(textureName));
        this.position = new TSM.vec2([0, 0]);
        this.animations = [];
        this.activeAnimation = null;
    }

    addAnimation(name: string, textureNames: string[], frameDelays?: number[]) {
        if (this.animations[name] != null) {
            return;
        }

        if (frameDelays == null) {
            frameDelays = [];
            for (var i = 0; i < textureNames.length; ++i) {
                frameDelays[i] = 0.2;
            }
        }

        this.animations[name] = new Animation(textureNames, frameDelays);
    }

    setActiveAnimation(name: string) {
        if (this.animations[name] == null) {
            return;
        }

        this.activeAnimation = name;
        this.animations[this.activeAnimation].play();
    }

    updateAnimation(dt: number) {
        this.animations[this.activeAnimation].update(dt);
    }

    setController(controller: Controller) {
        this.controller = controller;
    }

    update(dt: number) {
        if (this.controller != null) {
            this.controller.update(dt);
        }

        if (this.activeAnimation != null) {
            this.updateAnimation(dt);
            this.sprite.texture = this.animations[this.activeAnimation].getTexture();
        }

        this.sprite.position = this.position;
    }

    render() {
        this.sprite.render();
    }
} 