var GameObjectManager = (function () {
    function GameObjectManager() {
        this.gameObjects = {};
        this.renderOrdered = [];
    }
    GameObjectManager.prototype.add = function (gameObject, entityId) {
        if (this.gameObjects[entityId] == null) {
            this.gameObjects[entityId] = gameObject;
            gameObject.entityId = entityId;
            this.insertIntoOrderedBuffer(gameObject);
        }
        return gameObject;
    };

    GameObjectManager.prototype.insertIntoOrderedBuffer = function (gameObject) {
        var index = this.binarySearch(this.renderOrdered, gameObject.position.y, 0, this.renderOrdered.length - 1);
        this.renderOrdered.splice(index, 0, gameObject);
        gameObject.renderOrderIndex = index;
    };

    GameObjectManager.prototype.binarySearch = function (A, key, imin, imax) {
        if (imax < imin) {
            return imax;
        } else {
            var imid = Math.ceil((imin + imax) / 2);

            var pos = A[imid].position.y;
            if (pos > key) {
                return this.binarySearch(A, key, imin, imid - 1);
            } else if (pos < key) {
                return this.binarySearch(A, key, imid + 1, imax);
            } else {
                return imid + 1;
            }
        }
    };

    GameObjectManager.prototype.recalcOrder = function (index) {
        var newIndex = index;
        var testIndex = index + 1;
        while (this.renderOrdered[testIndex] != null && this.renderOrdered[testIndex].position.y < this.renderOrdered[newIndex].position.y) {
            ++newIndex;
            ++testIndex;
        }
        testIndex = index - 1;
        while (this.renderOrdered[testIndex] != null && this.renderOrdered[testIndex].position.y > this.renderOrdered[newIndex].position.y) {
            --newIndex;
            --testIndex;
        }

        if (index != newIndex) {
            this.renderOrdered[index].renderOrderIndex = newIndex;
            this.renderOrdered[newIndex].renderOrderIndex = index;
            Util.arrayMove(this.renderOrdered, index, newIndex);
        }
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
        for (var i = 0, len = this.renderOrdered.length; i < len; ++i) {
            this.renderOrdered[i].render();
        }
    };
    return GameObjectManager;
})();
//# sourceMappingURL=gameobjectmanager.js.map
