export class MainLayoutService {
    public static injectionName = 'Required.MainLayoutService';
    public static $inject = ['$log'];

    constructor(private $log: ng.ILogService) {
    }
}