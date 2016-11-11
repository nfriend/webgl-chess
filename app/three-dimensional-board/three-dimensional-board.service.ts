export class ThreeDimensionalBoardService {
    public static injectionName = 'WebGLChess.ThreeDimensionalBoardService';
    public static $inject = ['$log'];

    constructor(private $log: ng.ILogService) {
    }
}