var WorldObjectType;
(function (WorldObjectType) {
    WorldObjectType[WorldObjectType["Mountain"] = 0] = "Mountain";
    WorldObjectType[WorldObjectType["Tree"] = 1] = "Tree";
})(WorldObjectType || (WorldObjectType = {}));

var WorldObjectDescriptor = (function () {
    function WorldObjectDescriptor(pos, type) {
        this.position = pos;
        this.objectType = type;
    }
    return WorldObjectDescriptor;
})();

var WorldObjects = (function () {
    function WorldObjects() {
        this.currentObjectId = 1;

        this.freeIdStack = [];
        this.worldObjects = {};
        this.worldDescriptors = [];

        this.textureMap = {};
        this.textureMap[0 /* Mountain */] = "mountain";
        this.textureMap[1 /* Tree */] = "tree";

        var width = game.config["world_width"];
        var height = game.config["world_height"];
        this.width = width;
        this.height = height;
        var data = game.config["world_data"];
        for (var index in data) {
            var d = data[index];
            var pos = this.indexToCoordinate(index);
            var right = data[this.coordinatesToIndex(pos.x + 1, pos.y)];
            var left = data[this.coordinatesToIndex(pos.x - 1, pos.y)];
            var top = data[this.coordinatesToIndex(pos.x, pos.y - 1)];
            var bottom = data[this.coordinatesToIndex(pos.x, pos.y + 1)];

            if (d == 6 && (right != 6 || left != 6 || top != 6 || bottom != 6)) {
                var position = new TSM.vec3([index % width, Math.floor(index / width), 0]);
                this.worldDescriptors.push(new WorldObjectDescriptor(position, 0 /* Mountain */));
            }
        }

        for (var i = 0, len = this.worldDescriptors.length; i < len; ++i) {
            var sprite = new Sprite(3, 3);
            sprite.setShader(game.spriteShader);
            sprite.alpha = true;
            var r = Math.floor(Math.random() * 2);
            sprite.texture = game.textures.getTexture((r == 0) ? "mountain" : "tree0");
            sprite.rotation.x = 90 - game.camera.cameraAngle;
            sprite.position = this.worldDescriptors[i].position;
            sprite.position.x -= Math.floor(width / 2);
            sprite.position.y -= Math.floor(height / 2);
            var gameObj = game.gameObjects.add(new GameObject(null, null, sprite), 10000 + i);
            this.worldObjects[this.currentObjectId++] = gameObj;
        }
    }
    WorldObjects.prototype.indexToCoordinate = function (index) {
        return {
            x: index % this.width,
            y: Math.floor(index / this.width)
        };
    };

    WorldObjects.prototype.coordinatesToIndex = function (x, y) {
        return y * this.width + x % this.width;
    };

    WorldObjects.prototype.update = function (dt) {
        for (var k in this.worldObjects) {
            var obj = this.worldObjects[k];
            var update = true;
            if (obj.position.y < game.camera.position.y - 20) {
                update = false;
            }
            if (obj.position.y > game.camera.position.y + 2) {
                update = false;
            }
            if (obj.position.x > game.camera.position.x + 18) {
                update = false;
            }
            if (obj.position.x < game.camera.position.x - 18) {
                update = false;
            }
            if (update) {
                var terrainHeight = game.terrain.getTerrainHeight(obj.position, 0) - 0.5;
                obj.position.z = terrainHeight;
            }
        }
    };

    WorldObjects.prototype.render = function () {
        for (var k in this.worldObjects) {
            var obj = this.worldObjects[k];
            var render = true;
            if (obj.position.y < game.camera.position.y - 20) {
                render = false;
            }
            if (obj.position.y > game.camera.position.y + 2) {
                render = false;
            }
            if (obj.position.x > game.camera.position.x + 18) {
                render = false;
            }
            if (obj.position.x < game.camera.position.x - 18) {
                render = false;
            }
            if (render) {
                this.worldObjects[k].render();
            }
        }
    };
    return WorldObjects;
})();
//# sourceMappingURL=worldobjects.js.map
