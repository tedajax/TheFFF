class Util {
    static deg2Rad: number = 0.0174532925;
    static rad2Deg: number = 57.2957795;

    static toDegrees(radians: number) {
        return radians * Util.rad2Deg;
    }

    static toRadians(degrees: number) {
        return degrees * Util.deg2Rad;
    }
}