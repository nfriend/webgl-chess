import { MainLayoutService } from './main-layout.service';

export class MainLayoutController {
    public static injectionName = 'Required.MainLayoutService';
    public static $inject = ['$log', MainLayoutService.injectionName];

    constructor(private $log: ng.ILogService, private mainLayoutService: MainLayoutService) {
    }
    
}