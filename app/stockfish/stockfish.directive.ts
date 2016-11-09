import { StockfishController } from './stockfish.controller';

export class StockfishDirective {
    public static injectionName = 'stockfish';
    public template = require('./stockfish.html');
    public controller = StockfishController;
    public bindToController = true;
    public controllerAs = 'vm';
    public scope = {};
}