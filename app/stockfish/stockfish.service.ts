export class StockfishService {
    public static injectionName = 'WebGLChess.StockfishService';
    public static $inject = ['$log', '$q'];

    private THINKING_TIME = 3000;
    private engine: Worker;
    private isInitialized = false;

    constructor(private $log: ng.ILogService, private $q: ng.IQService) {

    }

    private init(): ng.IPromise<any> {
        if (this.isInitialized) {
            // exit this function and return an already-resolved promise
            return this.$q.resolve(true);
        }

        this.engine = new Worker('stockfish.js');
        this.engine.onmessage = this.processMessage;
        this.engine.postMessage('uci');
        return this.waitUntil(/^uciok/).then(() => {
            this.engine.postMessage('ucinewgame');
            this.engine.postMessage('isready');
            return this.waitUntil(/^readyok/);
        }).then(() => {
            this.isInitialized = true;
        });
    }

    private processMessage = (ev: MessageEvent) => {
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
            return move.from + move.to;
        });

        return this.init().then(() => {
            let msg = 'position startpos moves ' + pastMoves.join(' ');
            console.log(msg)
            this.engine.postMessage(msg);
            this.engine.postMessage('go movetime ' + this.THINKING_TIME);
            return this.waitUntil(/^bestmove/);
        }).then(message => {
            let bestMove = message.trim().split(/\s+/)[1];
            return chess.move({
                from: bestMove.substr(0, 2),
                to: bestMove.substr(2, 2)
            });
        });
    }
}