type fileType = 'obj' | 'mtl';

interface ObjectHolder {
    [objectName: string]: {
        obj: string;
        mtl: string;
    }
}

export class ObjService {
    public static injectionName = 'WebGLChess.ObjService';
    public static $inject = ['$log', '$http', '$q'];

    constructor(private $log: ng.ILogService, private $http: ng.IHttpService, private $q: ng.IQService) {
    }

    private objFilepaths: ObjectHolder = {
        pawn: {
            obj: 'assets/obj/pawn.obj',
            mtl: 'assets/obj/pawn.mtl',
        }
    };

    private objs: ObjectHolder = {};

    public downloadObjs(): ng.IPromise<any> {
        const allPromises: ng.IPromise<any>[] = [];
        Object.keys(this.objFilepaths).forEach(key => {
            allPromises.push(this.downloadObj(key, 'obj', this.objFilepaths[key].obj));
            allPromises.push(this.downloadObj(key, 'mtl', this.objFilepaths[key].mtl));
        });
        return this.$q.all(allPromises).then(() => {
            console.log('done!');
            debugger;
        })
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
        });
    }
}