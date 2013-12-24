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
})(Sprite);

var WorldTerrain = (function () {
    function WorldTerrain() {
        this.terrainEllipseDepth = 40;
        this.terrainEllipseHeight = 3;
        this.terrainFollowCam = true;

        this.tileWidth = 1;
        this.tileHeight = 1;
        this.worldWidth = 38;
        this.worldHeight = 23;
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

        this.tileCountX = Math.ceil(this.worldWidth / this.tileWidth) + 1;
        this.tileCountY = Math.ceil(this.worldHeight / this.tileHeight) + 1;

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

        this.quadsByTexture = [];
        for (var i = 0; i < this.tileCountY; ++i) {
            for (var j = 0; j < this.tileCountX; ++j) {
                var quad = this.worldQuads[i][j];
                if (this.quadsByTexture[quad.textureIndex] == null) {
                    this.quadsByTexture[quad.textureIndex] = new PoolArray();
                }
                quad.subIndex = this.quadsByTexture[quad.textureIndex].push(quad);
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
        if (game.input.getKeyDown(Keys.SPACE)) {
            this.terrainFollowCam = !this.terrainFollowCam;
        }

        if (this.terrainFollowCam) {
            this.terrainReferencePoint = game.camera.position.y + 2;
        }

        for (var i = 0; i < this.tileCountY; ++i) {
            for (var j = 0; j < this.tileCountX; ++j) {
                var quad = this.worldQuads[i][j];
                var textureNeedsUpdating = false;
                var left = game.camera.position.x - (this.worldWidth / 2) - this.tileWidth;
                var right = game.camera.position.x + (this.worldWidth / 2) + this.tileWidth;
                var top = game.camera.position.y - (this.worldHeight - 4) - this.tileWidth;
                var bottom = game.camera.position.y + 4 + this.tileWidth;
                while (quad.position.x < left) {
                    quad.position.x += this.worldWidth * this.tileWidth;
                    textureNeedsUpdating = true;
                }
                while (quad.position.x > right) {
                    quad.position.x -= this.worldWidth * this.tileWidth;
                    textureNeedsUpdating = true;
                }

                while (quad.position.y < top) {
                    quad.position.y += (this.worldHeight + 1) * this.tileHeight;
                    textureNeedsUpdating = true;
                }
                while (quad.position.y > bottom) {
                    quad.position.y -= (this.worldHeight + 1) * this.tileHeight;
                    textureNeedsUpdating = true;
                }

                var front = this.getTerrainHeight(quad.position, 0.5);
                var back = this.getTerrainHeight(quad.position, -0.5);
                var yDiff = front - back;
                var arctan = Math.atan2(yDiff, 1);
                quad.rotation.x = arctan * Util.rad2Deg;
                quad.position.z = (front + back) / 2;
                quad.scale.y = 1 + arctan;

                if (textureNeedsUpdating) {
                    var tile = this.worldSpaceToTileSpace(quad.position);
                    quad.setTexture(this.getTextureAtTile(tile));

                    this.quadsByTexture[quad.textureIndex].removeAt(quad.subIndex);
                    quad.textureIndex = this.getTextureIndexAtTile(tile);
                    if (this.quadsByTexture[quad.textureIndex] == null) {
                        this.quadsByTexture[quad.textureIndex] = new PoolArray();
                    }
                    quad.subIndex = this.quadsByTexture[quad.textureIndex].push(quad);
                }
            }
        }
    };

    WorldTerrain.prototype.getTerrainHeight = function (position, offset) {
        var b = this.terrainEllipseDepth / 2;
        var a = this.terrainEllipseHeight;
        var c = this.terrainReferencePoint - b;
        var diff = c - (position.y + offset);
        var diffsqr = Math.pow(diff, 2);
        if (Math.abs(diff) > b) {
            return 0;
        }
        var asqr = Math.pow(a, 2);
        var bsqr = Math.pow(b, 2);
        var result = Math.max(Math.sqrt(((-asqr * diffsqr) / bsqr) + asqr), 0);

        return -result;
    };

    WorldTerrain.prototype.render = function () {
        for (var i = 0, len = this.textureMapping.length; i < len; ++i) {
            if (this.quadsByTexture[i] != null) {
                for (var j = 0, len2 = this.quadsByTexture[i].length; j < len2; ++j) {
                    var q = this.quadsByTexture[i].at(j);
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

        return new TSM.vec3([ty * this.tileHeight, tx * this.tileWidth, 0]);
    };

    WorldTerrain.prototype.cameraTileMin = function () {
        var camTL = TSM.vec3.sum(game.camera.position, new TSM.vec3([-this.worldWidth / 2, 0, 0]));
        return this.worldSpaceToTileSpace(camTL);
    };

    WorldTerrain.prototype.cameraTileMax = function () {
        var camBR = TSM.vec3.sum(game.camera.position, new TSM.vec3([this.worldWidth / 2, 0, 0]));
        return this.worldSpaceToTileSpace(camBR);
    };
    return WorldTerrain;
})();
//# sourceMappingURL=worldterrain.js.map
