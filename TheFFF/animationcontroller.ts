class ActiveAnimation {
    name: string;
    priority: number;

    constructor(name: string, priority?: number) {
        this.name = name;
        this.priority = (priority != null) ? priority : 0;
    }
}

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
        this.animations.push(game.animationFactory.getAnimation(this.klass, name));
    }

    addAnimations(names: string[]) {
        for (var i = 0, len = names.length; i < len; ++i) {
            this.addAnimation(names[i]);
        }
    }

    playAnimation(name: string) {
        if (this.animations[name] != null) {
            this.animations[name].play();
        }
    }
}