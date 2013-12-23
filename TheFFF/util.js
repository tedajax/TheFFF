var Util = (function () {
    function Util() {
    }
    Util.toDegrees = function (radians) {
        return radians * Util.rad2Deg;
    };

    Util.toRadians = function (degrees) {
        return degrees * Util.deg2Rad;
    };
    Util.deg2Rad = 0.0174532925;
    Util.rad2Deg = 57.2957795;
    return Util;
})();

var PoolArray = (function () {
    function PoolArray(capacity) {
        if (typeof capacity === "undefined") { capacity = 64; }
        this.maxIndex = 0;
        this.array = new Array(capacity);
        this.freeStack = [];
        for (var i = capacity - 1; i >= 0; --i) {
            this.freeStack.push(i);
        }
    }
    Object.defineProperty(PoolArray.prototype, "length", {
        get: function () {
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });

    PoolArray.prototype.push = function (obj) {
        var index = -1;
        if (this.freeStack.length > 0) {
            index = this.freeStack.pop();
        }
        if (index > 0) {
            this.array[index] = obj;
        } else {
            index = this.array.push(obj) - 1;
        }

        if (index > this.maxIndex) {
            this.maxIndex = index;
        }

        return index;
    };

    PoolArray.prototype.removeAt = function (index) {
        if (this.array[index] != null) {
            this.array[index] = null;
            this.freeStack.push(index);
        }
    };

    PoolArray.prototype.at = function (index) {
        return this.array[index];
    };
    return PoolArray;
})();
//# sourceMappingURL=util.js.map
