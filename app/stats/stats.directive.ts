import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

export class StatsDirective {
    public static injectionName = 'stats';
    public static $inject = [StatsService.injectionName];
    public template = require('./stats.html');
    public controller = StatsController;
    public bindToController = true;
    public controllerAs = 'vm';
    public scope = {};

    constructor(private statsService: StatsService) {

    }

    public link = ($scope: ng.IScope, $element: JQuery) => {
        this.statsService.statInstance.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        $element.find('.stats').append(this.statsService.statInstance.dom);
    }
}