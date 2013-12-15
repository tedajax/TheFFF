class ImageTexture {
    texture: WebGLTexture;
    image: HTMLImageElement;
    loaded: boolean;

    bindTextureParameters() {
        game.gl.bindTexture(game.gl.TEXTURE_2D, this.texture);
        game.gl.pixelStorei(game.gl.UNPACK_FLIP_Y_WEBGL, Number(false));
        game.gl.texImage2D(game.gl.TEXTURE_2D, 0, game.gl.RGBA, game.gl.RGBA, game.gl.UNSIGNED_BYTE, this.image);
        game.gl.texParameteri(game.gl.TEXTURE_2D, game.gl.TEXTURE_MAG_FILTER, game.gl.NEAREST);
        game.gl.texParameteri(game.gl.TEXTURE_2D, game.gl.TEXTURE_MIN_FILTER, game.gl.NEAREST);
        game.gl.bindTexture(game.gl.TEXTURE_2D, null);
        this.loaded = true;
    }
}

class TextureManager {
    textures: ImageTexture[];

    constructor() {
        this.textures = [];
    }

    loadTexture(name, url) {
        if (this.textures[name] != null) {
            return this.textures[name];
        }

        var imgTexture = new ImageTexture();
        imgTexture.texture = game.gl.createTexture();
        imgTexture.loaded = false;
        imgTexture.image = new Image();
        imgTexture.image.onload = () => {
            imgTexture.bindTextureParameters();
        }
        imgTexture.image.src = url;

        this.textures[name] = imgTexture;
        return this.textures[name];
    }

    getTexture(name) {
        return this.textures[name];
    }
} 