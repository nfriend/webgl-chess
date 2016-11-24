export class ChessJsService {
    public static injectionName = 'WebGLChess.ChessJsService';
    public static $inject = ['$log', '$window'];

    constructor(private $log: ng.ILogService, private $window: ng.IWindowService) {
    }

    private _chess: chessjs.Chess;
    public get chess(): chessjs.Chess {
        if (!this._chess) {
            this._chess = new Chess();
        }

        // make this available globally so we can debug 
        // the state of the board via the console
        if (!this.$window['chess']) {
            this.$window['chess'] = this._chess;
        }

        return this._chess;
    }
}