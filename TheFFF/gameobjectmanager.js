var GameObjectManager = (function () {
    function GameObjectManager() {
        this.gameObjects = {};
    }
    GameObjectManager.prototype.add = function (gameObject, entityId) {
        if (this.gameObjects[entityId] == null) {
            this.gameObjects[entityId] = gameObject;
        }
        return gameObject;
    };

    GameObjectManager.prototype.remove = function (entityId) {
        if (entityId in this.gameObjects) {
            delete this.gameObjects[entityId];
        }
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
