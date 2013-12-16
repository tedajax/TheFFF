var WorldTerrain = (function () {
    function WorldTerrain() {
        this.tileWidth = 64;
        this.tileHeight = 64;
        this.width = 256;
        this.height = 256;

        this.textureMapping = [];
        this.textureMapping[1] = "dirt0";
        this.textureMapping[2] = "dirt1";
        this.textureMapping[3] = "grass0";
        this.textureMapping[4] = "grass1";
        this.textureMapping[5] = "grass2";
        this.textureMapping[6] = "mtn0";
        this.textureMapping[7] = "water0";
        this.textureMapping[8] = "water1";

        //this.worldDescriptor = this.genMap(this.width, this.height);
        var data = game.config.world_data;
        this.worldDescriptor = [];
        var index = 0;
        for (var i = 0; i < this.width; ++i) {
            this.worldDescriptor[i] = [];
            for (var j = 0; j < this.height; ++j) {
                this.worldDescriptor[i][j] = data[index++];
            }
        }

        this.tileCountX = Math.ceil(game.canvas.width / this.tileWidth) + 2;
        this.tileCountY = Math.ceil(game.canvas.height / this.tileHeight) + 1;

        this.worldQuads = [];
        var tileTopLeft = this.cameraTileMin();
        var tx = tileTopLeft.x;
        var ty = tileTopLeft.y;
        for (var i = 0; i < this.tileCountX; ++i) {
            this.worldQuads[i] = [];
            for (var j = 0; j < this.tileCountY; ++j) {
                this.worldQuads[i][j] = new Quad();
                this.worldQuads[i][j].setShader(game.spriteShader);
                this.worldQuads[i][j].position = this.tileSpaceToWorldSpace(new TSM.vec2([tx, ty]));
                this.worldQuads[i][j].setTexture(game.textures.getTexture(this.textureMapping[this.worldDescriptor[tx][ty]]));
                ++ty;
            }
            ++tx;
            ty = tileTopLeft.y;
        }
    }
    WorldTerrain.prototype.genMap = function (width, height) {
        var world = [];
        for (var i = 0; i < width; ++i) {
            world[i] = [];
            for (var j = 0; j < height; ++j) {
                world[i][j] = 1;
            }
        }

        for (var r = 0; r < 1000; ++r) {
            var t = Math.floor(Math.random() * 7) + 2;
            var rad = Math.floor(Math.random() * 5) + 1;
            var x = Math.floor(Math.random() * width);
            var y = Math.floor(Math.random() * height);
            for (var i = x - rad; i < x + rad; ++i) {
                for (var j = y - rad; j < y + rad; ++j) {
                    if (world[i] != null && world[i][j] != null) {
                        world[i][j] = t;
                    }
                }
            }
        }

        return world;
    };

    WorldTerrain.prototype.update = function () {
        for (var i = 0; i < this.tileCountX; ++i) {
            for (var j = 0; j < this.tileCountY; ++j) {
                var quad = this.worldQuads[i][j];
                var textureNeedsUpdating = false;
                while (quad.position.x < game.camera.position.x - this.tileWidth) {
                    quad.position.x += game.width + this.tileWidth;
                    textureNeedsUpdating = true;
                }
                while (quad.position.x > game.camera.position.x + game.canvas.width) {
                    quad.position.x -= game.width + this.tileWidth;
                    textureNeedsUpdating = true;
                }

                while (quad.position.y < game.camera.position.y - this.tileHeight) {
                    quad.position.y += game.height + this.tileHeight;
                    textureNeedsUpdating = true;
                }
                while (quad.position.y > game.camera.position.y + game.canvas.height) {
                    quad.position.y -= game.height + this.tileHeight;
                    textureNeedsUpdating = true;
                }

                if (textureNeedsUpdating) {
                    var tile = this.worldSpaceToTileSpace(quad.position);
                    quad.setTexture(this.getTextureAtTile(tile));
                }
            }
        }
    };

    WorldTerrain.prototype.render = function () {
        for (var i = 0; i < this.tileCountX; ++i) {
            for (var j = 0; j < this.tileCountY; ++j) {
                this.worldQuads[i][j].render();
            }
        }
    };

    WorldTerrain.prototype.getTextureAtTile = function (tile) {
        var row = this.worldDescriptor[tile.x];
        if (row == null) {
            return game.textures.getTexture("water1");
        }
        var wd = row[tile.y];
        if (wd != null) {
            return game.textures.getTexture(this.textureMapping[wd]);
        } else {
            return game.textures.getTexture("water1");
        }
    };

    WorldTerrain.prototype.worldSpaceToTileSpace = function (world) {
        var tileSpaceX = Math.floor(world.x / this.tileWidth) + Math.floor(this.width / 2);
        var tileSpaceY = Math.floor(world.y / this.tileHeight) + Math.floor(this.height / 2);

        return new TSM.vec2([tileSpaceX, tileSpaceY]);
    };

    WorldTerrain.prototype.tileSpaceToWorldSpace = function (tile) {
        var tx = tile.x - Math.floor(this.width / 2);
        var ty = tile.y - Math.floor(this.height / 2);

        return new TSM.vec2([tx * this.tileWidth, ty * this.tileHeight]);
    };

    WorldTerrain.prototype.cameraTileMin = function () {
        return this.worldSpaceToTileSpace(TSM.vec2.sum(game.camera.position, new TSM.vec2([-game.width / 2, 0])));
    };

    WorldTerrain.prototype.cameraTileMax = function () {
        return TSM.vec2.sum(this.worldSpaceToTileSpace(TSM.vec2.sum(game.camera.position, new TSM.vec2([game.width / 2, 0]))), new TSM.vec2([1, 1]));
    };
    return WorldTerrain;
})();
//# sourceMappingURL=worldterrain.js.map
