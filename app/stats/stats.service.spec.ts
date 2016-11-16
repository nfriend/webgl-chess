import { StatsService } from './stats.service';

describe('stats', () => {

    let statsService: StatsService;
    let $log: ng.ILogService;

    beforeEach(inject((_$log_) => {
        $log = _$log_;
        statsService = new StatsService($log);
    }));

    it(`tests StatsService's sanity`, () => {
        expect(statsService).toBeDefined();
    });
});