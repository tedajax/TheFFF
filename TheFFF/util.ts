class Util {
    static deg2Rad: number = 0.0174532925;
    static rad2Deg: number = 57.2957795;

    static toDegrees(radians: number) {
        return radians * Util.rad2Deg;
    }

    static toRadians(degrees: number) {
        return degrees * Util.deg2Rad;
    }

    static arrayMove(A: any[], oldIndex: number, newIndex: number) {
        if (oldIndex < 0 || oldIndex >= A.length ||
            newIndex < 0 || newIndex >= A.length) {
                return A;
        }
        A.splice(newIndex, 0, A.splice(oldIndex, 1)[0]);
        return A;
    }

    static nextPowerOf2(value: number, pow: number = 1) {
        while (pow < value) {
            pow *= 2;
        }
        return pow;
    }
}

class PoolArray<T> {
    array: T[];
    maxIndex;
    freeStack: number[];

    constructor(capacity: number = 64) {
        this.maxIndex = 0;
        this.array = new Array(capacity);
        this.freeStack = [];
        for (var i = capacity - 1; i >= 0; --i) {
            this.freeStack.push(i);
        }
    }

    get length(): number {
        return this.array.length;
    }

    push(obj: T) {
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
    }

    removeAt(index: number) {
        if (this.array[index] != null) {
            this.array[index] = null;
            this.freeStack.push(index);
        }
    }

    at(index: number): T {
        return this.array[index];
    }
}

