import { MainLayoutService } from './main-layout.service';

export class MainLayoutController {
    public static injectionName = 'WebGLChess.MainLayoutService';
    public static $inject = ['$log', MainLayoutService.injectionName];

    boardToShow: string;

    constructor(private $log: ng.ILogService, private mainLayoutService: MainLayoutService) {
    }
    
}