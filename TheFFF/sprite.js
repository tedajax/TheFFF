var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(width, height) {
        if (width === void 0) { width = Sprite.defaultWidth; }
        if (height === void 0) { height = Sprite.defaultHeight; }
        var _this = _super.call(this) || this;
        _this.mesh = game.meshFactory.createQuad(1, 1);
        _this.alpha = false;
        _this.width = width;
        _this.height = height;
        _this.scale.x = _this.width;
        _this.scale.y = _this.height;
        _this.origin = new TSM.vec2([_this.width / 2, _this.height / 2]);
        _this.billboard = false;
        _this.bindTexture = true;
        return _this;
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
}(Renderable));
//# sourceMappingURL=sprite.js.map