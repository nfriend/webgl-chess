import { Obj } from './obj-parser';

interface ObjectHolder {
    [objectName: string]: Obj
}

export class ObjService {
    public static injectionName = 'WebGLChess.ObjService';
    public static $inject = ['$log', '$http', '$q', '$timeout'];

    constructor(private $log: ng.ILogService, private $http: ng.IHttpService, private $q: ng.IQService, private $timeout: ng.ITimeoutService) {
    }

    public objs: ObjectHolder = {};

    private objFilepaths: {
        [objectName: string]: {
            [type: string]: string;
        }
    } = {
        pawn: { obj: 'assets/obj/pawn.obj' },
        // knight: { obj: 'assets/obj/knight.obj' },
        // rook: { obj: 'assets/obj/rook.obj' },
        // bishop: { obj: 'assets/obj/bishop.obj' },
        // queen: { obj: 'assets/obj/queen.obj' },
        // king: { obj: 'assets/obj/king.obj' },
    };

    public downloadObjs(): ng.IPromise<any> {
        const deferred = this.$q.defer();
        let completedCount = 0;
        let totalCount = 0;
        const allPromises: ng.IPromise<any>[] = [];
        const allKeys = Object.keys(this.objFilepaths);

        // figure out how many things we have to download in total
        allKeys.forEach(k => {
            totalCount += Object.keys(this.objFilepaths[k]).length;
        });

        allKeys.forEach(key => {
            Object.keys(this.objFilepaths[key]).forEach(type => {
                allPromises.push(this.downloadObj(key, type, this.objFilepaths[key][type]).then(() => {
                    deferred.notify({
                        current: ++completedCount,
                        total: totalCount,
                        loadingText: this.objFilepaths[key][type]
                    });
                }));
            });
        });

        this.$q.all(allPromises).then(() => {
            deferred.resolve();
        });

        return deferred.promise;
    }

    private downloadObj(key: string, type: string, filepath: string): ng.IPromise<void> {
        return this.$http.get(filepath).then(response => {
            let deferred = this.$q.defer<void>();
            if (type === 'obj') {
                let ObjectParserWorker = require('worker?inline!./obj-parser.ts');
                let worker: Worker = new ObjectParserWorker();
                worker.postMessage(response.data + '');
                worker.onmessage = event => { 
                    this.objs[key] = event.data;
                    deferred.resolve();
                };
            } else {
                throw 'Download type not yet implemented: ' + type;
            }
            return deferred.promise;
        });
    }
}