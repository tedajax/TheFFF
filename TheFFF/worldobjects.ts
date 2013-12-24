enum WorldObjectType {
    Mountain,
    Tree
}

class WorldObjectDescriptor {
    position: TSM.vec3;
    objectType: WorldObjectType;

    constructor(pos: TSM.vec3, type: WorldObjectType) {
        this.position = pos;
        this.objectType = type;
    }
}

class WorldObjects {
    worldDescriptors: WorldObjectDescriptor[];
    width: number;
    height: number;
    worldObjects: {};
    freeIdStack: number[];
    currentObjectId: number;

    textureMap: {};

    constructor() {
        this.currentObjectId = 1;

        this.freeIdStack = [];
        this.worldObjects = {};
        this.worldDescriptors = [];

        this.textureMap = {};
        this.textureMap[WorldObjectType.Mountain] = "mountain";
        this.textureMap[WorldObjectType.Tree] = "tree";

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
                this.worldDescriptors.push(new WorldObjectDescriptor(position, WorldObjectType.Mountain));
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

    indexToCoordinate(index: number) {
        return {
            x: index % this.width,
            y: Math.floor(index / this.width)
        };
    }

    coordinatesToIndex(x: number, y: number) {
        return y * this.width + x % this.width;
    }

    update(dt: number) {
        for (var k in this.worldObjects) {
            var obj = <Sprite>this.worldObjects[k];
            var update: boolean = true;
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
    }

    render() {
        for (var k in this.worldObjects) {
            var obj = <Sprite>this.worldObjects[k];
            var render: boolean = true;
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
    }
}