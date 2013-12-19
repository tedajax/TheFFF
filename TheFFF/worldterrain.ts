class TerrainQuad extends Quad {
    textureIndex: number;
    subIndex: number;
}

class WorldTerrain {
    worldDescriptor: number[][]
    textureMapping: string[]
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    tileCountX: number;
    tileCountY: number;

    worldQuads: TerrainQuad[][]
    quadsByTexture: TerrainQuad[][];

    constructor() {
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

        this.quadsByTexture = [];
        for (var i = 0; i < this.tileCountY; ++i) {
            for (var j = 0; j < this.tileCountX; ++j) {
                var quad = this.worldQuads[i][j];
                if (this.quadsByTexture[quad.textureIndex] == null) {
                    this.quadsByTexture[quad.textureIndex] = [];
                }
                this.quadsByTexture[quad.textureIndex].push(quad);
                quad.subIndex = this.quadsByTexture[quad.textureIndex].length - 1;
            }
        }
    }

    genMapRandomly(width: number, height: number) {
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
            var x = Math.floor(Math.random() * width)
            var y = Math.floor(Math.random() * height)
            for (var i = x - rad; i < x + rad; ++i) {
                for (var j = y - rad; j < y + rad; ++j) {
                    if (world[i] != null && world[i][j] != null) {
                        world[i][j] = t;
                    }
                }
            }
        }

        return world;
    }

    genMapFromData(data: Object) {
        var world = [];
        var index = 0;
        for (var i = 0; i < this.height; ++i) {
            world[i] = [];
            for (var j = 0; j < this.width; ++j) {
                world[i][j] = data[index++];
            }
        }
        return world;
    }

    update() {
        for (var i = 0; i < this.tileCountY; ++i) {
            for (var j = 0; j < this.tileCountX; ++j) {
                var quad = this.worldQuads[i][j];
                var textureNeedsUpdating: boolean = false;
                var left = game.camera.position.x - (game.width / 2) - this.tileWidth;
                var right = game.camera.position.y + (game.width / 2) + this.tileWidth;
                var top = game.camera.position.y - (game.height / 2) - this.tileHeight;
                var bottom = game.camera.position.y + (game.height / 2) + this.tileHeight
                while (quad.position.x < left) {
                    quad.position.x += game.width + this.tileWidth;
                    textureNeedsUpdating = true;
                }
                while (quad.position.x > right) {
                    quad.position.x -= game.width + this.tileWidth;
                    textureNeedsUpdating = true;
                }

                while (quad.position.y < top) {
                    quad.position.y += game.height + this.tileHeight;
                    textureNeedsUpdating = true;
                }
                while (quad.position.y > bottom) {
                    quad.position.y -= game.height + this.tileHeight;
                    textureNeedsUpdating = true;
                }

                if (textureNeedsUpdating) {
                    var tile = this.worldSpaceToTileSpace(quad.position);
                    quad.setTexture(this.getTextureAtTile(tile));

                    this.quadsByTexture[quad.textureIndex][quad.subIndex] = null;
                    quad.textureIndex = this.getTextureIndexAtTile(tile);
                    if (this.quadsByTexture[quad.textureIndex] == null) {
                        this.quadsByTexture[quad.textureIndex] = [];
                    }
                    this.quadsByTexture[quad.textureIndex].push(quad);
                    quad.subIndex = this.quadsByTexture[quad.textureIndex].length - 1;
                }
            }
        }
    }

    render() {
        for (var i = 0, len = this.textureMapping.length; i < len; ++i) {
            if (this.quadsByTexture[i] != null) {
                for (var j = 0, len2 = this.quadsByTexture[i].length; j < len2; ++j) {
                    var q = this.quadsByTexture[i][j];
                    if (q != null) {
                        q.render();
                    }
                }
            }
        }
    }

    getTextureAtTile(tile: TSM.vec2) {
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
    }

    getTextureIndexAtTile(tile: TSM.vec2): number {
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
    }

    worldSpaceToTileSpace(world: TSM.vec2): TSM.vec2 {
        var tileSpaceX = Math.floor(world.x / this.tileWidth) + Math.floor(this.width / 2);
        var tileSpaceY = Math.floor(world.y / this.tileHeight) + Math.floor(this.height / 2);

        return new TSM.vec2([tileSpaceY, tileSpaceX]);
    }

    tileSpaceToWorldSpace(tile: TSM.vec2): TSM.vec2 {
        var tx = tile.x - Math.floor(this.width / 2);
        var ty = tile.y - Math.floor(this.height / 2);

        return new TSM.vec2([ty * this.tileHeight, tx * this.tileWidth])
    }

    cameraTileMin(): TSM.vec2 {
        var camPos = new TSM.vec2([game.camera.position.x, game.camera.position.y]);
        return this.worldSpaceToTileSpace(TSM.vec2.sum(camPos, new TSM.vec2([-game.width / 2, 0])));
    }

    cameraTileMax(): TSM.vec2 {
        var camPos = new TSM.vec2([game.camera.position.x, game.camera.position.y]);
        return TSM.vec2.sum(this.worldSpaceToTileSpace(TSM.vec2.sum(camPos, new TSM.vec2([game.width / 2, 0]))), new TSM.vec2([1, 1]));
    }
}