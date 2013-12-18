var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TerrainQuad = (function (_super) {
    __extends(TerrainQuad, _super);
    function TerrainQuad() {
        _super.apply(this, arguments);
    }
    return TerrainQuad;
})(Quad);

var WorldTerrain = (function () {
    function WorldTerrain() {
        this.tileWidth = 64;
        this.tileHeight = 64;
        this.width = game.config["world_width"];
        this.height = game.config["world_height"];

        this.textureMapping = [];
        this.textureMapping[1] = "dirt0";
        this.textureMapping[2] = "dirt1";
        this.textureMapping[3] = "grass0";
        this.textureMapping[4] = "grass1";
        this.textureMapping[5] = "grass2";
        this.textureMapping[6] = "mtn0";
        this.textureMapping[7] = "water0";
        this.textureMapping[8] = "water1";

        //this.worldDescriptor = this.genMapRandomly(this.width, this.height);
        this.worldDescriptor = this.genMapFromData(game.config["world_data"]);

        this.tileCountX = Math.ceil(game.canvas.width / this.tileWidth) + 1;
        this.tileCountY = Math.ceil(game.canvas.height / this.tileHeight) + 1;

        this.worldQuads = [];
        var tileTopLeft = this.cameraTileMin();

        for (var i = 0; i < this.tileCountY; ++i) {
            this.worldQuads[i] = [];
            for (var j = 0; j < this.tileCountX; ++j) {
                var trow = j + tileTopLeft.x;
                var tcol = i + tileTopLeft.y;
                var tilePosition = new TSM.vec2([tcol, trow]);
                var quad = new TerrainQuad();
                quad.setShader(game.spriteShader);
                quad.position = this.tileSpaceToWorldSpace(tilePosition);
                quad.setTexture(this.getTextureAtTile(tilePosition));
                this.worldQuads[i][j] = quad;
                this.worldQuads[i][j].textureIndex = this.getTextureIndexAtTile(tilePosition);
            }
        }
    }
    WorldTerrain.prototype.genMapRandomly = function (width, height) {
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

    WorldTerrain.prototype.genMapFromData = function (data) {
        var world = [];
        var index = 0;
        for (var i = 0; i < this.height; ++i) {
            world[i] = [];
            for (var j = 0; j < this.width; ++j) {
                world[i][j] = data[index++];
            }
        }
        return world;
    };

    WorldTerrain.prototype.update = function () {
        for (var i = 0; i < this.tileCountY; ++i) {
            for (var j = 0; j < this.tileCountX; ++j) {
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
                    quad.textureIndex = this.getTextureIndexAtTile(tile);
                }
            }
        }
    };

    WorldTerrain.prototype.render = function () {
        var quadsByTexture = [];
        for (var i = 0; i < this.tileCountY; ++i) {
            for (var j = 0; j < this.tileCountX; ++j) {
                var quad = this.worldQuads[i][j];
                if (quadsByTexture[quad.textureIndex] == null) {
                    quadsByTexture[quad.textureIndex] = [];
                }
                quadsByTexture[quad.textureIndex].push(quad);
            }
        }

        for (var i = 0, len = this.textureMapping.length; i < len; ++i) {
            if (quadsByTexture[i] != null) {
                for (var j = 0, len2 = quadsByTexture[i].length; j < len2; ++j) {
                    var q = quadsByTexture[i][j];
                    if (q != null) {
                        q.render();
                    }
                }
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

    WorldTerrain.prototype.getTextureIndexAtTile = function (tile) {
        var row = this.worldDescriptor[tile.x];
        if (row == null) {
            return 0;
        }
        var wd = row[tile.y];
        if (wd != null) {
            return wd;
        } else {
            return 0;
        }
    };

    WorldTerrain.prototype.worldSpaceToTileSpace = function (world) {
        var tileSpaceX = Math.floor(world.x / this.tileWidth) + Math.floor(this.width / 2);
        var tileSpaceY = Math.floor(world.y / this.tileHeight) + Math.floor(this.height / 2);

        return new TSM.vec2([tileSpaceY, tileSpaceX]);
    };

    WorldTerrain.prototype.tileSpaceToWorldSpace = function (tile) {
        var tx = tile.x - Math.floor(this.width / 2);
        var ty = tile.y - Math.floor(this.height / 2);

        return new TSM.vec2([ty * this.tileHeight, tx * this.tileWidth]);
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
