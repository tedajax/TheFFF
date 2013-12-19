class GameObject {
    sprite: Quad;
    position: TSM.vec2;
    controller: Controller;
    activeAnimation: string;
    animations: AnimationController;

    constructor(klass: string, animations?: string[]) {
        this.sprite = new Quad(0, 128, 128);
        this.sprite.setShader(game.spriteShader);
        this.position = new TSM.vec2([0, 0]);
        this.activeAnimation = null;

        var anims = animations && animations || ["idle"];
        this.animations = new AnimationController(klass, anims);
    }

    playAnimation(name: string) {
        this.animations.play(name);
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

        this.animations.update(dt);
        this.sprite.texture = this.animations.getCurrentTexture();
        
        this.sprite.position = this.position;
    }

    render() {
        this.sprite.render();
    }
} 