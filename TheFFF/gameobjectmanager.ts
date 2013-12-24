class GameObjectManager {
    gameObjects: {};
    renderOrdered: GameObject[];

    constructor() {
        this.gameObjects = {};
        this.renderOrdered = [];
    }

    add(gameObject: GameObject, entityId: number) {
        if (this.gameObjects[entityId] == null) {
            this.gameObjects[entityId] = gameObject;
            gameObject.entityId = entityId;
            this.insertIntoOrderedBuffer(gameObject);
        }
        return gameObject;
    }

    insertIntoOrderedBuffer(gameObject: GameObject) {
        var index = this.binarySearch(this.renderOrdered, gameObject.position.y, 0, this.renderOrdered.length - 1);
        this.renderOrdered.splice(index, 0, gameObject);
        gameObject.renderOrderIndex = index;
    }
    
    binarySearch(A: GameObject[], key: number, imin: number, imax: number) {
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
    }

    recalcOrder(index: number) {
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
        for (var i = 0, len = this.renderOrdered.length; i < len; ++i) {
            this.renderOrdered[i].render();
        }
    }
} 