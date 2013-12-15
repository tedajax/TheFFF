class GameObjectManager {
    gameObjects: GameObject[];

    constructor() {
        this.gameObjects = [];
    }

    add(gameObject: GameObject) {
        this.gameObjects.push(gameObject);
        return gameObject;
    }

    update(dt) {
        for (var i = 0; i < this.gameObjects.length; ++i) {
            this.gameObjects[i].update(dt);
        }
    }

    render() {
        for (var i = 0; i < this.gameObjects.length; ++i) {
            this.gameObjects[i].render();
        }
    }
} 