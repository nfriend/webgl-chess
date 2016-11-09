export class StockfishService {
    public static injectionName = 'WebGLChess.StockfishService';
    public static $inject = ['$log', '$q'];
    
    private THINKING_TIME = 3000;
    private engine: Worker;

    constructor(private $log: ng.ILogService, private $q: ng.IQService) {
        this.init();
    }

    private init(): ng.IPromise<any> {
        this.engine = new Worker('stockfish.js');
        this.engine.onmessage = this.processMessage;
        this.engine.postMessage('uci');
        return this.waitUntil(/^uciok/).then(() => {
            this.engine.postMessage('ucinewgame');
            this.engine.postMessage('isready');
            return this.waitUntil(/^readyok/);
        }).then(() => {
            this.engine.postMessage('position startpos');
            this.engine.postMessage('isready');
            return this.waitUntil(/^readyok/);
        }).then(() => {
            this.engine.postMessage('position startpos');
            this.engine.postMessage('isready');
            return this.waitUntil(/^readyok/);
        }).then(() => {
            this.engine.postMessage('go movetime ' + this.THINKING_TIME);
            return this.waitUntil(/^bestmove/);
        }).then(message => {
            console.log('done!', message);
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
}