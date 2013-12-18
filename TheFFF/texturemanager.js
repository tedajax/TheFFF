var ImageTexture = (function () {
    function ImageTexture() {
    }
    ImageTexture.prototype.bindTextureParameters = function () {
        game.gl.bindTexture(game.gl.TEXTURE_2D, this.texture);
        game.gl.pixelStorei(game.gl.UNPACK_FLIP_Y_WEBGL, Number(false));
        game.gl.texImage2D(game.gl.TEXTURE_2D, 0, game.gl.RGBA, game.gl.RGBA, game.gl.UNSIGNED_BYTE, this.image);
        game.gl.texParameteri(game.gl.TEXTURE_2D, game.gl.TEXTURE_MAG_FILTER, game.gl.NEAREST);
        game.gl.texParameteri(game.gl.TEXTURE_2D, game.gl.TEXTURE_MIN_FILTER, game.gl.NEAREST);
        game.gl.bindTexture(game.gl.TEXTURE_2D, null);
        this.loaded = true;
    };
    return ImageTexture;
})();

var TextureManager = (function () {
    function TextureManager() {
        this.textures = [];
    }
    TextureManager.prototype.loadTexture = function (name, url) {
        if (this.textures[name] != null) {
            return this.textures[name];
        }

        var imgTexture = new ImageTexture();
        imgTexture.texture = game.gl.createTexture();
        imgTexture.loaded = false;
        imgTexture.name = name;
        console.log(name);
        imgTexture.image = new Image();
        imgTexture.image.onload = function () {
            imgTexture.bindTextureParameters();
        };
        imgTexture.image.src = url;

        this.textures[name] = imgTexture;
        return this.textures[name];
    };

    TextureManager.prototype.getTexture = function (name) {
        return this.textures[name];
    };
    return TextureManager;
})();
//# sourceMappingURL=texturemanager.js.map
