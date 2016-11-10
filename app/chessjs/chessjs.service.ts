export class ChessJsService {
    public static injectionName = 'WebGLChess.ChessJsService';
    public static $inject = ['$log'];

    constructor(private $log: ng.ILogService) {
    }

    private _chess: chessjs.Chess;
    public get chess(): chessjs.Chess {
        if (!this._chess) {
            this._chess = new Chess();
        }

        return this._chess;
    }
}