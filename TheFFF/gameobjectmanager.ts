class GameObjectManager {
    gameObjects: {};

    constructor() {
        this.gameObjects = {};
    }

    add(gameObject: GameObject, entityId: number) {
        if (this.gameObjects[entityId] == null) {
            this.gameObjects[entityId] = gameObject;
        }
        return gameObject;
    }

    remove(entityId: number) {
        if (entityId in this.gameObjects) {
            delete this.gameObjects[entityId];
        }
    }

    update(dt) {
        for (var key in this.gameObjects) {
            var go = this.gameObjects[key];
            if (go != null) {
                go.update(dt);
            }
        }
    }

    render() {
        for (var key in this.gameObjects) {
            var go = this.gameObjects[key];
            if (go != null) {
                go.render();
            }
        }
    }
} 