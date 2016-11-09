import { MainLayoutService } from './main-layout.service';

describe('main-layout', () => {

    let mainLayoutService: MainLayoutService;
    let $log: ng.ILogService;

    beforeEach(inject((_$log_) => {
        $log = _$log_;
        mainLayoutService = new MainLayoutService($log);
    }));

    it(`tests MainLayoutService's sanity`, () => {
        expect(mainLayoutService).toBeDefined();
    });
});