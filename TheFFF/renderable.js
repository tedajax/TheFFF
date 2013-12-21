/// <reference path="WebGL.d.ts" />
/// <reference path="tsm-0.7.d.ts" />
var Renderable = (function () {
    function Renderable(depth) {
        if (typeof depth === "undefined") { depth = 0; }
        this.position = TSM.vec2.zero;
        this.scale = new TSM.vec2([1, 1]);
        this.depth = depth;
    }
    Renderable.prototype.setShader = function (shader) {
        this.shader = shader;
    };

    Renderable.prototype.hide = function () {
        this.hidden = true;
    };

    Renderable.prototype.show = function () {
        this.hidden = false;
    };

    Renderable.prototype.requestRender = function () {
        if (!this.hidden) {
            render();
        }
    };

    Renderable.prototype.render = function () {
    };

    Renderable.prototype.buildWorldMatrix = function () {
        var scale = new TSM.mat4().setIdentity();
        scale.scale(new TSM.vec3([this.scale.x, this.scale.y, 1]));
        var translation = new TSM.mat4().setIdentity();
        translation.translate(new TSM.vec3([this.position.x, this.position.y, this.depth]));

        return translation.multiply(scale);
    };
    return Renderable;
})();
//# sourceMappingURL=renderable.js.map
