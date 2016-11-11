import { TwoDimensionalBoardController } from './two-dimensional-board.controller';

export class TwoDimensionalBoardDirective {
    public static injectionName = 'twoDimensionalBoard';
    public template = require('./two-dimensional-board.html');
    public controller = TwoDimensionalBoardController;
    public bindToController = true;
    public controllerAs = 'vm';
    public scope = {};
}