export class Utility {
    public static radiansToDegrees = (radians: number): number => {
        return radians * (180 / Math.PI);
    }

    public static degreesToRadians = (degrees: number): number => {
        return degrees * (Math.PI / 180);
    }
}