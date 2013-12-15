var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Controller = (function () {
    function Controller(gameObject) {
        this.gameObject = gameObject;
        if (this.gameObject != null) {
            this.gameObject.setController(this);
        }

        this.position = new TSM.vec2([0, 0]);
        this.velocity = new TSM.vec2([0, 0]);
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
        if (sync.moveableState != null) {
            this.velocity.x = sync.moveableState.velocity.x;
            this.velocity.y = sync.moveableState.velocity.y;
        }
        this.gameObject.position.x = sync.transformState.position.x;
        this.gameObject.position.y = sync.transformState.position.y;
    };

    Controller.prototype.getStateSyncInfo = function () {
        var info = {
            "transformState": {
                "position": {
                    "x": this.gameObject.position.x,
                    "y": this.gameObject.position.y
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
    };
    return Controller;
})();

var LocalPlayerController = (function (_super) {
    __extends(LocalPlayerController, _super);
    function LocalPlayerController(gameObject) {
        _super.call(this, gameObject);
    }
    LocalPlayerController.prototype.update = function (dt) {
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

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.gameObject.position = this.position;

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
        var vx = this.velocity.x * dt;
        var vy = this.velocity.y * dt;
        this.position.x += vx;
        this.position.y += vy;
        this.gameObject.position = this.position;
    };
    return NetworkPlayerController;
})(Controller);
//# sourceMappingURL=controllers.js.map
