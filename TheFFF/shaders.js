/// <reference path="tsm-0.7.d.ts" /> 
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
var Shader = /** @class */ (function () {
    function Shader() {
        this.name = "default";
        this.attribs = [];
        this.uniforms = [];
    }
    Shader.prototype.initialize = function () {
        var fragmentShader = this.getFragShader();
        var vertexShader = this.getVertShader();
        this.program = game.gl.createProgram();
        game.gl.attachShader(this.program, vertexShader);
        game.gl.attachShader(this.program, fragmentShader);
        game.gl.linkProgram(this.program);
        if (!game.gl.getProgramParameter(this.program, game.gl.LINK_STATUS)) {
            alert("Failed to link shader " + name);
        }
        if (this.program != null) {
            game.gl.useProgram(this.program);
        }
    };
    Shader.prototype.addAttribute = function (name, attribute) {
        this.attribs[name] = game.gl.getAttribLocation(this.program, attribute);
        game.gl.enableVertexAttribArray(this.attribs[name]);
    };
    Shader.prototype.addUniform = function (name, uniform) {
        this.uniforms[name] = game.gl.getUniformLocation(this.program, uniform);
    };
    Shader.prototype.frameDrawSetup = function () {
    };
    Shader.prototype.objectDrawSetup = function () {
    };
    Shader.prototype.initLocales = function () {
    };
    Shader.prototype.getShader = function (shaderType) {
        var shaderStr;
        var shaderFilename;
        if (shaderType == game.gl.FRAGMENT_SHADER) {
            shaderFilename = Shader.SHADER_PATH + this.name + ".frag";
        }
        else if (shaderType == game.gl.VERTEX_SHADER) {
            shaderFilename = Shader.SHADER_PATH + this.name + ".vert";
        }
        else {
            return null;
        }
        shaderStr = this.getFileString(shaderFilename);
        var shader = game.gl.createShader(shaderType);
        game.gl.shaderSource(shader, shaderStr);
        game.gl.compileShader(shader);
        if (!game.gl.getShaderParameter(shader, game.gl.COMPILE_STATUS)) {
            alert(shaderFilename + "\n" + game.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
    Shader.prototype.getFragShader = function () {
        return this.getShader(game.gl.FRAGMENT_SHADER);
    };
    Shader.prototype.getVertShader = function () {
        return this.getShader(game.gl.VERTEX_SHADER);
    };
    Shader.prototype.getFileString = function (file) {
        var request = new XMLHttpRequest();
        request.open("GET", "./" + file, false);
        request.send();
        return request.responseText;
    };
    Shader.SHADER_PATH = "assets/shaders/";
    return Shader;
}());
var SpriteShader = /** @class */ (function (_super) {
    __extends(SpriteShader, _super);
    function SpriteShader() {
        var _this = _super.call(this) || this;
        _this.name = "sprite";
        _this.fogEnabled = true;
        _this.fogStart = 13;
        _this.fogEnd = 20;
        _this.fogColor = new Float32Array([1, 1, 1, 1]);
        return _this;
    }
    SpriteShader.prototype.initLocales = function () {
        _super.prototype.initLocales.call(this);
        game.gl.useProgram(this.program);
        this.addAttribute("position", "aVertexPosition");
        this.addAttribute("uv", "aVertexUV");
        this.addAttribute("color", "aVertexColor");
        this.addUniform("world", "uWorld");
        this.addUniform("view", "uView");
        this.addUniform("projection", "uProjection");
        this.addUniform("texture", "uTexture");
        this.addUniform("cameraPosition", "uCameraPosition");
        this.addUniform("fogColor", "uFogColor");
        this.addUniform("fogStart", "uFogStart");
        this.addUniform("fogEnd", "uFogEnd");
        this.addUniform("fogEnabled", "uFogEnabled");
    };
    SpriteShader.prototype.frameDrawSetup = function () {
        _super.prototype.frameDrawSetup.call(this);
        //game.gl.useProgram(this.program);
        this.projectionMatrix = game.camera.getProjectionMatrix();
        this.viewMatrix = game.camera.getViewMatrix();
        game.gl.uniformMatrix4fv(this.uniforms["projection"], false, this.projectionMatrix.all());
        game.gl.uniformMatrix4fv(this.uniforms["view"], false, this.viewMatrix.all());
        game.gl.uniform3fv(this.uniforms["cameraPosition"], game.camera.position.xyz);
        game.gl.uniform4fv(this.uniforms["fogColor"], this.fogColor);
        game.gl.uniform1f(this.uniforms["fogStart"], this.fogStart);
        game.gl.uniform1f(this.uniforms["fogEnd"], this.fogEnd);
        game.gl.uniform1i(this.uniforms["fogEnabled"], (this.fogEnabled) ? 1 : 0);
    };
    SpriteShader.prototype.bindTexture = function () {
        if (this.texture != null && this.texture.loaded && this.texture != this.lastBoundTexture) {
            game.gl.activeTexture(game.gl.TEXTURE0);
            game.gl.bindTexture(game.gl.TEXTURE_2D, this.texture.texture);
            game.gl.uniform1i(this.uniforms["texture"], 0);
            this.lastBoundTexture = this.texture;
        }
    };
    SpriteShader.prototype.objectDrawSetup = function () {
        _super.prototype.objectDrawSetup.call(this);
        //game.gl.useProgram(this.program);
        game.gl.uniformMatrix4fv(this.uniforms["world"], false, this.worldMatrix.all());
    };
    return SpriteShader;
}(Shader));
//# sourceMappingURL=shaders.js.map