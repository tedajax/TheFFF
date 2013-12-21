/// <reference path="WebGL.d.ts" />
/// <reference path="tsm-0.7.d.ts" />

class Renderable {
    hidden: boolean;
    depth: number;

    shader: Shader;
    position: TSM.vec2;
    origin: TSM.vec2;
    scale: TSM.vec2;
    rotation: TSM.vec3;

    mesh: Mesh;

    constructor(depth: number = 0) {
        this.position = new TSM.vec2([0, 0]);
        this.origin = new TSM.vec2([0, 0]);
        this.scale = new TSM.vec2([1, 1]);
        this.rotation = new TSM.vec3([0, 0, 0]);
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

        var rotation = new TSM.mat4().setIdentity();
        rotation.rotate(this.rotation.z, TSM.vec3.forward);
        rotation.rotate(this.rotation.x * 0.0174532925, TSM.vec3.right);

        var translation = new TSM.mat4().setIdentity();
        translation.translate(new TSM.vec3([this.position.x, this.position.y, this.depth]));

        var origin = new TSM.mat4().setIdentity();
        origin.translate(new TSM.vec3([-this.origin.x, -this.origin.y, 0]));
        
        return translation.multiply(rotation.multiply(origin.multiply(scale)));
    }
} 