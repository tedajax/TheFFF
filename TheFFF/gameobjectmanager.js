var GameObjectManager = (function () {
    function GameObjectManager() {
        this.gameObjects = [];
    }
    GameObjectManager.prototype.add = function (gameObject) {
        this.gameObjects.push(gameObject);
        return gameObject;
    };

    GameObjectManager.prototype.update = function (dt) {
        for (var i = 0; i < this.gameObjects.length; ++i) {
            this.gameObjects[i].update(dt);
        }
    };

    GameObjectManager.prototype.render = function () {
        for (var i = 0; i < this.gameObjects.length; ++i) {
            this.gameObjects[i].render();
        }
    };
    return GameObjectManager;
})();
//# sourceMappingURL=gameobjectmanager.js.map
