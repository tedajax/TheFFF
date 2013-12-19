class AnimationController {
    klass: string;
    animations: Animation[];
        
    constructor(klass: string, animations?: string[]) {
        this.klass = klass;
        this.animations = [];
        if (animations != null) {
            this.addAnimations(animations);
        }
    }

    addAnimation(name: string) {
        var anim = game.animationFactory.getAnimation(this.klass, name);
        if (anim != null && this.animations[name] == null) {
            this.animations[name] = anim;
        }
    }

    addAnimations(names: string[]) {
        for (var i = 0, len = names.length; i < len; ++i) {
            this.addAnimation(names[i]);
        }
    }

    play(name: string, loop: boolean = false) {
        if (this.animations[name] != null) {
            this.animations[name].play(loop);
        }
    }

    stop(name: string) {
        if (this.animations[name] != null) {
            this.animations[name].stop();
        }
    }

    update(dt: number) {
        for (var key in this.animations) {
            var anim: Animation = <Animation>this.animations[key];
            anim.update(dt);
        }
    }

    getCurrentTexture() {
        var maxPriority = -10000;
        var texture: ImageTexture;
        for (var key in this.animations) {
            var anim = <Animation>this.animations[key];
            if (anim.playing) {
                if (anim.priority > maxPriority) {
                    maxPriority = anim.priority;
                    texture = anim.getTexture();
                }
            }
        }

        return texture;
    }
}