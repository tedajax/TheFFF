var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var StateFrame = (function () {
    function StateFrame() {
        this.position = new TSM.vec2([0, 0]);
        this.velocity = new TSM.vec2([0, 0]);
        this.time = new Date().getTime();
    }
    StateFrame.prototype.clone = function (other) {
        this.position.x = other.position.x;
        this.position.y = other.position.y;
        this.velocity.x = other.velocity.x;
        this.velocity.y = other.velocity.y;
        this.time = other.time;
    };

    StateFrame.lerp = function (a, b, t) {
        var result = new StateFrame();
        result.position.x = StateFrame.lerpf(a.position.x, b.position.x, t);
        result.position.y = StateFrame.lerpf(a.position.y, b.position.y, t);
        return result;
    };

    StateFrame.lerpf = function (a, b, t) {
        if (t < 0) {
            t = 0;
        } else if (t > 1) {
            t = 1;
        }
        return a + (b - a) * t;
    };
    return StateFrame;
})();

var Controller = (function () {
    function Controller(gameObject) {
        this.gameObject = gameObject;
        if (this.gameObject != null) {
            this.gameObject.setController(this);
        }

        this.position = new TSM.vec2([0, 0]);
        this.velocity = new TSM.vec2([0, 0]);

        this.previous = new StateFrame();
        this.current = new StateFrame();
    }
    Controller.prototype.posess = function (gameObject) {
        if (gameObject == null) {
            return;
        }

        if (this.gameObject != null) {
            this.gameObject.setController(null);
        }

        this.gameObject = gameObject;
        this.gameObject.setController(this);
    };

    Controller.prototype.handleStateSync = function (sync) {
        this.previous.clone(this.current);
        this.current.time = new Date().getTime();
        if (sync.moveableState != null) {
            this.current.velocity.x = sync.moveableState.velocity.x;
            this.current.velocity.y = sync.moveableState.velocity.y;
        }
        this.current.position.x = sync.transformState.position.x;
        this.current.position.y = sync.transformState.position.y;
    };

    Controller.prototype.getStateSyncInfo = function () {
        var info = {
            "transformState": {
                "position": {
                    "x": this.position.x,
                    "y": this.position.y
                }
            },
            "moveableState": {
                "velocity": {
                    "x": this.velocity.x,
                    "y": this.velocity.y
                }
            }
        };

        return info;
    };

    Controller.prototype.unposess = function () {
        this.gameObject.setController(null);
        this.gameObject = null;
    };

    Controller.prototype.update = function (dt) {
        if (this.gameObject == null) {
            return;
        }

        var time = new Date().getTime() - 100;
        var perc = (time - this.previous.time) / (this.current.time - this.previous.time);
        this.interp = StateFrame.lerp(this.previous, this.current, perc);
        this.gameObject.position.x = this.interp.position.x;
        this.gameObject.position.y = this.interp.position.y;
    };
    return Controller;
})();

var LocalPlayerController = (function (_super) {
    __extends(LocalPlayerController, _super);
    function LocalPlayerController(gameObject) {
        _super.call(this, gameObject);
        this.respectNetwork = true;
    }
    LocalPlayerController.prototype.update = function (dt) {
        if (this.respectNetwork) {
            _super.prototype.update.call(this, dt);
        }

        if (this.gameObject == null) {
            return;
        }

        var speed = 500;
        var moved = false;
        this.velocity.x = 0;
        this.velocity.y = 0;
        if (game.input.getKey(Keys.A)) {
            this.velocity.x = -speed;
            moved = true;
        }
        if (game.input.getKey(Keys.D)) {
            this.velocity.x = speed;
            moved = true;
        }
        if (game.input.getKey(Keys.W)) {
            this.velocity.y = -speed;
            moved = true;
        }
        if (game.input.getKey(Keys.S)) {
            this.velocity.y = speed;
            moved = true;
        }

        if (!this.respectNetwork) {
            this.position.x += this.velocity.x * dt;
            this.position.y += this.velocity.y * dt;
            this.gameObject.position = this.position;
        }

        if (game.input.getMouseButtonDown(MouseButtons.LEFT)) {
            this.gameObject.setActiveAnimation("Attack");
            this.attacking = true;
        }

        if (!this.attacking) {
            if (moved) {
                this.gameObject.setActiveAnimation("Walk");
            } else {
                this.gameObject.setActiveAnimation("Idle");
            }
        }
    };
    return LocalPlayerController;
})(Controller);

var NetworkPlayerController = (function (_super) {
    __extends(NetworkPlayerController, _super);
    function NetworkPlayerController(gameObject) {
        _super.call(this, gameObject);
    }
    NetworkPlayerController.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);

        var vx = this.current.velocity.x * dt;
        var vy = this.current.velocity.y * dt;

        //this.position.x += vx;
        //this.position.y += vy;
        this.gameObject.position = this.position;
    };
    return NetworkPlayerController;
})(Controller);
//# sourceMappingURL=controllers.js.map
