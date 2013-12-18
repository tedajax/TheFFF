var ActiveAnimation = (function () {
    function ActiveAnimation(name, priority) {
        this.name = name;
        this.priority = (priority != null) ? priority : 0;
    }
    return ActiveAnimation;
})();

var AnimationController = (function () {
    function AnimationController(klass, animations) {
        this.klass = klass;
        this.animations = [];
        if (animations != null) {
            this.addAnimations(animations);
        }
    }
    AnimationController.prototype.addAnimation = function (name) {
        this.animations.push(game.animationFactory.getAnimation(this.klass, name));
    };

    AnimationController.prototype.addAnimations = function (names) {
        for (var i = 0, len = names.length; i < len; ++i) {
            this.addAnimation(names[i]);
        }
    };

    AnimationController.prototype.playAnimation = function (name) {
        if (this.animations[name] != null) {
            this.animations[name].play();
        }
    };
    return AnimationController;
})();
//# sourceMappingURL=animationcontroller.js.map
