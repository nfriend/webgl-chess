import { StockfishService } from './stockfish.service';

describe('stockfish', () => {

    let stockfishService: StockfishService;
    let $log: ng.ILogService;
    let $q: ng.IQService;

    beforeEach(inject((_$log_, _$q_) => {
        $log = _$log_;
        $q = _$q_;
        stockfishService = new StockfishService($log, $q);
    }));

    it(`tests StockfishService's sanity`, () => {
        expect(stockfishService).toBeDefined();
    });
});