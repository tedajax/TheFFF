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

        this.mesh = game.meshFactory.createQuad(width, height);

        this.alpha = false;

        this.width = width;
        this.height = height;

        this.bindTexture = true;
    }
    Sprite.prototype.setTexture = function (texture) {
        this.texture = texture;
    };

    Sprite.prototype.setBindTexture = function (bind) {
        this.bindTexture = bind;
    };

    Sprite.prototype.render = function () {
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
