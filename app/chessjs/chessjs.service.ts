export class ChessJsService {
    public static injectionName = 'WebGLChess.ChessJsService';
    public static $inject = ['$log', '$window', '$stateParams'];

    constructor(private $log: ng.ILogService, private $window: ng.IWindowService, private $stateParams: ng.ui.IStateParamsService) {
    }

    private _chess: chessjs.Chess;
    public get chess(): chessjs.Chess {
        if (!this._chess) {
            this._chess = new Chess();
            
            if (this.$stateParams['moveHistory']) {
                let moves: Array<chessjs.Move> = [];
                try {
                    moves = JSON.parse(this.$stateParams['moveHistory']);
                } catch(e) {
                    console.error(`Couldn't parse move history from URL!`, e);
                }

                moves.forEach(move => {
                    if (!this.chess.move(move, { sloppy: true })) {
                        console.error('Unable to make move:', move);
                    }
                });
            }
        }

        // make this available globally so we can debug 
        // the state of the board via the console
        if (!this.$window['chess']) {
            this.$window['chess'] = this._chess;
        }

        return this._chess;
    }
}