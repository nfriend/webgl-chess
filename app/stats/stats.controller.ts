import { StatsService } from './stats.service';

export class StatsController {
    public static injectionName = 'WebGLChess.StatsService';
    public static $inject = ['$log', StatsService.injectionName];

    constructor(private $log: ng.ILogService, private statsService: StatsService) {
    }
    
}