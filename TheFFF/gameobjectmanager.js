var GameObjectManager = (function () {
    function GameObjectManager() {
        this.gameObjects = [];
    }
    GameObjectManager.prototype.add = function (gameObject, networkId) {
        if (this.gameObjects[networkId] == null) {
            this.gameObjects[networkId] = gameObject;
        }
        return gameObject;
    };

    GameObjectManager.prototype.update = function (dt) {
        for (var i = 0; i < this.gameObjects.length; ++i) {
            if (this.gameObjects[i] != null) {
                this.gameObjects[i].update(dt);
            }
        }
    };

    GameObjectManager.prototype.render = function () {
        for (var i = 0; i < this.gameObjects.length; ++i) {
            if (this.gameObjects[i] != null) {
                this.gameObjects[i].render();
            }
        }
    };
    return GameObjectManager;
})();
//# sourceMappingURL=gameobjectmanager.js.map
