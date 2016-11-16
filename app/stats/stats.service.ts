export class StatsService {
    public static injectionName = 'WebGLChess.StatsService';
    public static $inject = ['$log'];

    constructor(private $log: ng.ILogService) {
    }

    public statInstance = new Stats();
}