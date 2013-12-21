/// <reference path="WebGL.d.ts" />
/// <reference path="tsm-0.7.d.ts" />

class Renderable {
    hidden: boolean;
    depth: number;

    shader: Shader;
    position: TSM.vec2;
    scale: TSM.vec2;

    mesh: Mesh;

    constructor(depth: number = 0) {
        this.position = TSM.vec2.zero;
        this.scale = new TSM.vec2([1, 1]);
        this.depth = depth;
    }

    setShader(shader: Shader) {
        this.shader = shader;
    }
    
    hide() {
        this.hidden = true;
    }

    show() {
        this.hidden = false;
    }

    requestRender() {
        if (!this.hidden) {
            render();
        }
    }

    render() {
    }

    buildWorldMatrix() {
        var scale = new TSM.mat4().setIdentity();
        scale.scale(new TSM.vec3([this.scale.x, this.scale.y, 1]));
        var translation = new TSM.mat4().setIdentity();
        translation.translate(new TSM.vec3([this.position.x, this.position.y, this.depth]));

        return translation.multiply(scale);
    }
} 