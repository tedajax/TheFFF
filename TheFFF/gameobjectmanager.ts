class GameObjectManager {
    gameObjects: {};

    constructor() {
        this.gameObjects = {};
    }

    add(gameObject: GameObject, networkId: number) {
        if (this.gameObjects[networkId] == null) {
            this.gameObjects[networkId] = gameObject;
        }
        return gameObject;
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