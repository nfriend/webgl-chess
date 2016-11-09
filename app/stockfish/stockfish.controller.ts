import { StockfishService } from './stockfish.service';

export class StockfishController {
    public static injectionName = 'WebGLChess.StockfishService';
    public static $inject = ['$log', StockfishService.injectionName];

    constructor(private $log: ng.ILogService, private stockfishService: StockfishService) {
    }
    
}