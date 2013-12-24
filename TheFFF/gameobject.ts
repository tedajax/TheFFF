class GameObject {
    sprite: Sprite;
    position: TSM.vec3;
    oldPosition: TSM.vec3;
    controller: Controller;
    activeAnimation: string;
    animations: AnimationController;
    entityId: number;
    renderOrderIndex: number;

    constructor(klass?: string, animations?: string[], sprite?: Sprite) {
        if (sprite == null) {
            this.sprite = new Sprite(1, 1);
            this.sprite.setShader(game.spriteShader);
            this.position = new TSM.vec3([0, 0, 0]);
            this.oldPosition = new TSM.vec3([0, 0, 0]);
            this.activeAnimation = null;

            var anims = animations && animations || ["idle"];
            this.animations = new AnimationController(klass, anims);

            this.sprite.billboard = true;
            //this.sprite.rotation.x = 45;
        } else {
            this.sprite = sprite;
            this.position = sprite.position;
        }
    }

    playAnimation(name: string) {
        this.animations.play(name);
    }
    
    updateAnimation(dt: number) {
        if (this.animations != null) {
            this.animations.update(dt);
            this.sprite.texture = this.animations.getCurrentTexture();
        }
    }

    setController(controller: Controller) {
        this.controller = controller;
    }

    update(dt: number) {
        if (this.controller != null) {
            this.oldPosition.xyz = this.position.xyz;

            this.controller.update(dt);

            if (this.oldPosition.y != this.position.y) {
                game.gameObjects.recalcOrder(this.renderOrderIndex);
            }
        }

        this.updateAnimation(dt);
        
        var terrainHeight = game.terrain.getTerrainHeight(this.position, 0) - (this.sprite.height / 2);
        this.position.z = terrainHeight;
        this.sprite.position = this.position;
    }

    render() {
        if (game.camera.inRenderRange(this.position)) {
            this.sprite.render();
        }
    }
} 