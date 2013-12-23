var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(width, height) {
        if (typeof width === "undefined") { width = Sprite.defaultWidth; }
        if (typeof height === "undefined") { height = Sprite.defaultHeight; }
        _super.call(this);

        this.mesh = game.meshFactory.createQuad(1, 1);

        this.alpha = false;

        this.width = width;
        this.height = height;

        this.scale.x = this.width;
        this.scale.y = this.height;

        this.origin = new TSM.vec2([this.width / 2, this.height / 2]);

        this.billboard = false;

        this.bindTexture = true;
    }
    Sprite.prototype.setTexture = function (texture) {
        this.texture = texture;
    };

    Sprite.prototype.setBindTexture = function (bind) {
        this.bindTexture = bind;
    };

    Sprite.prototype.billboardSprite = function () {
        var xRot = Math.atan2(-(game.camera.position.z - this.position.z), game.camera.position.y - this.position.y);
        this.rotation.x = 90 - (xRot * Util.rad2Deg);
    };

    Sprite.prototype.render = function () {
        if (this.billboard) {
            this.billboardSprite();
        }

        var spriteShader = this.shader;
        spriteShader.worldMatrix = this.buildWorldMatrix();
        spriteShader.objectDrawSetup();
        if (this.bindTexture) {
            spriteShader.texture = this.texture;
            spriteShader.bindTexture();
        }

        game.renderer.setAlpha(this.alpha);

        this.mesh.render(this.shader);
    };
    Sprite.defaultWidth = 1;
    Sprite.defaultHeight = 1;
    return Sprite;
})(Renderable);
//# sourceMappingURL=sprite.js.map
