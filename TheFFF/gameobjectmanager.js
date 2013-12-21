var GameObjectManager = (function () {
    function GameObjectManager() {
        this.gameObjects = {};
    }
    GameObjectManager.prototype.add = function (gameObject, networkId) {
        if (this.gameObjects[networkId] == null) {
            this.gameObjects[networkId] = gameObject;
        }
        return gameObject;
    };

    GameObjectManager.prototype.update = function (dt) {
        for (var key in this.gameObjects) {
            var go = this.gameObjects[key];
            if (go != null) {
                go.update(dt);
            }
        }
    };

    GameObjectManager.prototype.render = function () {
        for (var key in this.gameObjects) {
            var go = this.gameObjects[key];
            if (go != null) {
                go.render();
            }
        }
    };
    return GameObjectManager;
})();
//# sourceMappingURL=gameobjectmanager.js.map
