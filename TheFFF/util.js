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
//# sourceMappingURL=util.js.map
