export class MainLayoutService {
    public static injectionName = 'WebGLChess.MainLayoutService';
    public static $inject = ['$log'];

    constructor(private $log: ng.ILogService) {
    }
}