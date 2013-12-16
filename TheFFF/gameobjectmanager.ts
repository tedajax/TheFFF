class GameObjectManager {
    gameObjects: GameObject[];

    constructor() {
        this.gameObjects = [];
    }

    add(gameObject: GameObject, networkId: number) {
        if (this.gameObjects[networkId] == null) {
            this.gameObjects[networkId] = gameObject;
        }
        return gameObject;
    }

    update(dt) {
        for (var i = 0; i < this.gameObjects.length; ++i) {
            if (this.gameObjects[i] != null) {
                this.gameObjects[i].update(dt);
            }
        }
    }

    render() {
        for (var i = 0; i < this.gameObjects.length; ++i) {
            if (this.gameObjects[i] != null) {
                this.gameObjects[i].render();
            }
        }
    }
} 