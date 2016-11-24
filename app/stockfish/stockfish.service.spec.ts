import { StockfishService } from './stockfish.service';

describe('stockfish', () => {

    let stockfishService: StockfishService;
    let $log: ng.ILogService;
    let $q: ng.IQService;
    let $stateParams: ng.ui.IStateParamsService;

    beforeEach(inject((_$log_, _$q_) => {
        $log = _$log_;
        $q = _$q_;
        $stateParams = <ng.ui.IStateParamsService>{};
        stockfishService = new StockfishService($log, $q, $stateParams);
    }));

    it(`tests StockfishService's sanity`, () => {
        expect(stockfishService).toBeDefined();
    });
});