/// <reference path="TSM/tsm.ts" /> 
/// <reference path="WebGL.d.ts" />

class Shader {
    name: string;
    program: WebGLProgram;
    attribs: number[];
    uniforms: WebGLUniformLocation[];

    constructor() {
        this.name = "default";
        this.attribs = [];
        this.uniforms = [];
    }

    initialize() {
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
    }

    addAttribute(name: string, attribute: string) {
        this.attribs[name] = game.gl.getAttribLocation(this.program, attribute);
        game.gl.enableVertexAttribArray(this.attribs[name]);
    }

    addUniform(name: string, uniform: string) {
        this.uniforms[name] = game.gl.getUniformLocation(this.program, uniform);
    }

    frameDrawSetup() {
    }

    objectDrawSetup() {
    }

    initLocales() {
    }

    getShader(shaderType: number) {
        var shaderStr: string;
        var shaderExtension: string;

        if (shaderType == game.gl.FRAGMENT_SHADER) {
            shaderExtension = this.name + "-fs.glsl";
        } else if (shaderType == game.gl.VERTEX_SHADER) {
            shaderExtension = this.name + "-vs.glsl";
        } else {
            return null;
        }

        shaderStr = this.getFileString(shaderExtension);

        var shader = game.gl.createShader(shaderType);
        game.gl.shaderSource(shader, shaderStr);
        game.gl.compileShader(shader);

        if (!game.gl.getShaderParameter(shader, game.gl.COMPILE_STATUS)) {
            alert(shaderExtension + "\n" + game.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    getFragShader() {
        return this.getShader(game.gl.FRAGMENT_SHADER);
    }

    getVertShader() {
        return this.getShader(game.gl.VERTEX_SHADER);
    }

    getFileString(file) {
        if (file == "sprite-fs.glsl") {
            return "precision highp float;              \
                                                        \
                    varying vec4 vVertexColor;          \
                    varying vec2 vVertexUV;             \
                    uniform sampler2D uTexture;         \
                                                        \
                    void main()                         \
                    {                                   \
                        gl_FragColor = vVertexColor;    \
                    }";
        } else if (file == "sprite-vs.glsl") {
            return "attribute vec3 aVertexPosition;                                             \
                    attribute vec4 aVertexColor;                                                \
                    attribute vec2 aVertexUV;                                                   \
                                                                                                \
                    varying vec4 vVertexColor;                                                  \
                    varying vec2 vVertexUV;                                                     \
                                                                                                \
                    uniform mat4 uWorld;                                                        \
                    uniform mat4 uView;                                                         \
                    uniform mat4 uProjection;                                                   \
                                                                                                \
                    void main()                                                                 \
                    {                                                                           \
                        mat4 modelView = uView * uWorld;                                        \
                                                                                                \
                        vVertexColor = aVertexColor;                                            \
                        vVertexUV = aVertexUV;                                                  \
                                                                                                \
                        gl_Position = uProjection * modelView * vec4(aVertexPosition, 1.0);     \
                    }";
        }

        var request = new XMLHttpRequest();
        request.open("GET", "./" + file, false);
        request.send();
        
        return request.responseText;
    }
}

class SpriteShader extends Shader {
    worldMatrix: TSM.mat4;
    viewMatrix: TSM.mat4;
    projectionMatrix: TSM.mat4;

    constructor() {
        super();

        this.name = "sprite";
    }

    initLocales() {
        super.initLocales();

        game.gl.useProgram(this.program);

        this.addAttribute("position", "aVertexPosition");
        this.addAttribute("uv", "aVertexUV");
        this.addAttribute("color", "aVertexColor");

        this.addUniform("world", "uWorld");
        this.addUniform("view", "uView");
        this.addUniform("projection", "uProjection");
        this.addUniform("texture", "uTexture");
    }

    frameDrawSetup() {
        super.frameDrawSetup();

        game.gl.useProgram(this.program);

        this.projectionMatrix = game.camera.getProjectionMatrix();
        this.viewMatrix = game.camera.getViewMatrix();

        game.gl.uniformMatrix4fv(this.uniforms["projection"], false, new Float32Array(this.projectionMatrix.all()));
        game.gl.uniformMatrix4fv(this.uniforms["view"], false, new Float32Array(this.viewMatrix.all()));
    }

    objectDrawSetup() {
        super.objectDrawSetup();

        game.gl.useProgram(this.program);

        game.gl.uniformMatrix4fv(this.uniforms["world"], false, new Float32Array(this.worldMatrix.all()));
    }
}