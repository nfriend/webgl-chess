type fileType = 'obj' | 'mtl';

interface ObjectHolder {
    [objectName: string]: {
        obj: string;
        mtl: string;
    }
}

export class ObjService {
    public static injectionName = 'WebGLChess.ObjService';
    public static $inject = ['$log', '$http', '$q', '$timeout'];

    constructor(private $log: ng.ILogService, private $http: ng.IHttpService, private $q: ng.IQService, private $timeout: ng.ITimeoutService) {
    }

    private objFilepaths: ObjectHolder = {
        pawn: {
            obj: 'assets/obj/pawn.obj',
            mtl: 'assets/obj/pawn.mtl',
        }
    };

    private objs: ObjectHolder = {};

    public downloadObjs(): ng.IPromise<any> {
        const deferred = this.$q.defer();
        let completedCount = 0;
        const allPromises: ng.IPromise<any>[] = [];
        const allKeys = Object.keys(this.objFilepaths);


        allKeys.forEach(key => {

            allPromises.push(this.downloadObj(key, 'obj', this.objFilepaths[key].obj).then(() => {
                deferred.notify({
                    current: ++completedCount,
                    total: allKeys.length * 2,
                    loadingText: this.objFilepaths[key].obj
                });
            }));

            allPromises.push(this.downloadObj(key, 'mtl', this.objFilepaths[key].mtl).then(() => {
                deferred.notify({
                    current: ++completedCount,
                    total: allKeys.length * 2,
                    loadingText: this.objFilepaths[key].mtl
                });
            }));

        });

        this.$q.all(allPromises).then(() => {
            deferred.resolve();
        });

        return deferred.promise;
    }

    private downloadObj(key: string, type: fileType, filepath: string): ng.IPromise<void> {
        return this.$http.get(filepath).then(response => {
            if (!this.objs[key]) {
                this.objs[key] = {
                    obj: null,
                    mtl: null
                };
            }
            
            this.objs[key][type] = response.data;
        }).then(() => {
            return this.$timeout(Math.random() * 1000 + 500);
        });
    }
}