export class StockfishService {
    public static injectionName = 'WebGLChess.StockfishService';
    public static $inject = ['$log', '$q', '$stateParams'];

    private THINKING_TIME = 1000;
    private engine: Worker;
    private isInitialized = false;
    private logStockfishInteractions = false;

    constructor(private $log: ng.ILogService, private $q: ng.IQService, private $stateParams: ng.ui.IStateParamsService) {
        this.logStockfishInteractions = $stateParams['stockfishLog'] === 'true';
    }

    private init(): ng.IPromise<any> {
        if (this.isInitialized) {
            // exit this function and return an already-resolved promise
            return this.$q.resolve(true);
        }

        this.engine = new Worker('stockfish.js');
        this.engine.onmessage = this.processMessage;
        this.postMessageToEngine('uci');
        return this.waitUntil(/^uciok/).then(() => {
            this.postMessageToEngine('ucinewgame');
            this.postMessageToEngine('isready');
            return this.waitUntil(/^readyok/);
        }).then(() => {
            this.isInitialized = true;
        });
    }

    private processMessage = (ev: MessageEvent) => {
        if (this.logStockfishInteractions) {
            this.$log.info('%c Stockfish output: ' + ev.data, 'background: #222; color: #55C8DA');
        }
        this.onEngineMessageCallbacks.forEach(cb => {
            cb(ev.data);
        });
    }

    private onEngineMessageCallbacks: Array<(message: string) => any> = [];
    public onEngineMessage(cb: (message: string) => any, removeAfterFire: boolean = false) {
        this.onEngineMessageCallbacks.push(cb);
    }

    public offEngineMessage(cb: (message: string) => any) {
        this.onEngineMessageCallbacks = this.onEngineMessageCallbacks.filter(onCb => onCb !== cb);
    }

    private waitUntil(pattern: RegExp): ng.IPromise<string> {
        let deferred = this.$q.defer();
        let cb = (message: string) => {
            if (pattern.test(message)) {
                this.offEngineMessage(cb);
                deferred.resolve(message);
            }
        };
        this.onEngineMessage(cb);
        return deferred.promise;
    }

    public executeNextMove(chess: chessjs.Chess): ng.IPromise<chessjs.Move> {
        const pastMoves = (<chessjs.Move[]>chess.history({ verbose: true })).map(move => {
            return move.from + move.to + (move.promotion ? move.promotion : '');
        });

        return this.init().then(() => {
            this.postMessageToEngine('position startpos moves ' + pastMoves.join(' '));
            this.postMessageToEngine('go movetime ' + this.THINKING_TIME);
            return this.waitUntil(/^bestmove/);
        }).then(message => {
            const bestMove = message.trim().split(/\s+/)[1];
            const attemptedMove = {
                from: bestMove.substr(0, 2),
                to: bestMove.substr(2, 2),
                promotion: bestMove.length > 4 ? bestMove.substr(4, 1) : undefined
            }
            const move = chess.move(attemptedMove);

            if (!move) {
                this.$log.error('Unable to complete move provided by stockfish! Stockfish returned: "' + message + '".  Attempted move: ', attemptedMove, 'History: ', chess.history({ verbose: true }));
            }

            return move;
        });
    }

    private postMessageToEngine(message: string) {
        if (this.logStockfishInteractions) {
            this.$log.info('%c Stockfish input: ' + message, 'background: #222; color: #bada55');
        }
        this.engine.postMessage(message);
    }
}