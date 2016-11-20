import { Obj } from './obj-parser';

interface ObjectHolder {
    [objectName: string]: Obj
}

interface TextureHolder {
    [textureName: string]: HTMLImageElement;
}

export class AssetService {
    public static injectionName = 'WebGLChess.AssetService';
    public static $inject = ['$log', '$http', '$q', '$timeout'];

    constructor(private $log: ng.ILogService, private $http: ng.IHttpService, private $q: ng.IQService, private $timeout: ng.ITimeoutService) {
    }

    public objs: ObjectHolder = {};
    public textures: TextureHolder = {};

    private objFilepaths: { [objectName: string]: string } = {
        pawnLight: 'assets/obj/pawn-light.obj',
        pawnDark: 'assets/obj/pawn-dark.obj',
        knight: 'assets/obj/knight.obj',
        rook: 'assets/obj/rook.obj',
        bishop: 'assets/obj/bishop.obj',
        queen: 'assets/obj/queen.obj',
        king: 'assets/obj/king.obj',
        squareDark: 'assets/obj/square-dark.obj'
    };

    private textureFilepaths: { [textureName: string]: string } = {
        lightWood: 'assets/textures/light-wood.jpg',
        darkWood: 'assets/textures/dark-wood.jpg',
    };

    public downloadAllAssets(): ng.IPromise<any> {
        const deferred = this.$q.defer();
        let completedCount = 0;
        let totalCount = Object.keys(this.objFilepaths).length + Object.keys(this.textureFilepaths).length;
        const allPromises: ng.IPromise<any>[] = [];

        Object.keys(this.objFilepaths).forEach(key => {
            allPromises.push(this.downloadObj(key, this.objFilepaths[key]).then(() => {
                deferred.notify({
                    current: ++completedCount,
                    total: totalCount,
                    loadingText: key
                });
            }));
        });

        Object.keys(this.textureFilepaths).forEach(key => {
            allPromises.push(this.downloadTexture(key, this.textureFilepaths[key]).then(() => {
                deferred.notify({
                    current: ++completedCount,
                    total: totalCount,
                    loadingText: this.textureFilepaths[key]
                });
            }));
        });

        this.$q.all(allPromises).then(() => {
            deferred.resolve();
        });

        return deferred.promise;
    }

    private downloadObj(key: string, filepath: string): ng.IPromise<void> {
        return this.$http.get(filepath).then(response => {
            let deferred = this.$q.defer<void>();
            let ObjectParserWorker = require('worker?inline!./obj-parser.ts');
            let worker: Worker = new ObjectParserWorker();
            worker.postMessage(response.data + '');
            worker.onmessage = event => {
                this.objs[key] = event.data;
                deferred.resolve();
            };

            return deferred.promise;
        });
    }

    private downloadTexture(key: string, filepath: string): ng.IPromise<void> {
        const deferred = this.$q.defer<void>();

        var image = new Image();
        image.onload = () => {
            this.textures[key] = image;
            deferred.resolve();
        };
        image.src = filepath;

        return deferred.promise;
    }
}