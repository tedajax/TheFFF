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
    }
    Controller.prototype.posess = function (gameObject) {
        this.gameObject.setController(null);
        this.gameObject = gameObject;
        this.gameObject.setController(this);
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
        if (game.input.getKey(Keys.A)) {
            this.gameObject.position.x -= speed * dt;
        }
        if (game.input.getKey(Keys.D)) {
            this.gameObject.position.x += speed * dt;
        }
        if (game.input.getKey(Keys.W)) {
            this.gameObject.position.y -= speed * dt;
        }
        if (game.input.getKey(Keys.S)) {
            this.gameObject.position.y += speed * dt;
        }
    };
    return LocalPlayerController;
})(Controller);
//# sourceMappingURL=controllers.js.map
