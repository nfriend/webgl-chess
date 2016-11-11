import { ThreeDimensionalBoardService } from './three-dimensional-board.service';

describe('three-dimensional-board', () => {

    let threeDimensionalBoardService: ThreeDimensionalBoardService;
    let $log: ng.ILogService;

    beforeEach(inject((_$log_) => {
        $log = _$log_;
        threeDimensionalBoardService = new ThreeDimensionalBoardService($log);
    }));

    it(`tests ThreeDimensionalBoardService's sanity`, () => {
        expect(threeDimensionalBoardService).toBeDefined();
    });
});