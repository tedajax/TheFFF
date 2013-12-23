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
        var data = game.config["world_data"];
        for (var index in data) {
            var d = data[index];
            if (d == 6) {
                var pos = new TSM.vec3([index % width, Math.floor(index / width), 0]);
                this.worldDescriptors.push(new WorldObjectDescriptor(pos, 0 /* Mountain */));
            }
        }

        for (var i = 0, len = this.worldDescriptors.length; i < len; ++i) {
            var obj = new Sprite(1, 1);
            obj.setShader(game.spriteShader);
            obj.alpha = true;
            obj.texture = game.textures.getTexture("mountain");
            obj.billboard = true;
            obj.position = this.worldDescriptors[i].position;
            obj.position.x -= Math.floor(width / 2);
            obj.position.y -= Math.floor(height / 2);
            this.worldObjects[this.currentObjectId++] = obj;
        }
    }
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
                var terrainHeight = game.camera.getTerrainHeight(obj.position, 0) - 0.5;
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
