import { ThreeDimensionalBoardService } from './three-dimensional-board.service';
import { ObjService } from './obj-service/obj.service';
import { WebGLManagerService } from './webgl-manager.service';

export class ThreeDimensionalBoardController {
    public static injectionName = 'WebGLChess.ThreeDimensionalBoardService';
    public static $inject = ['$log', '$scope', '$timeout', '$stateParams', ThreeDimensionalBoardService.injectionName, ObjService.injectionName, WebGLManagerService.injectionName];

    constructor(private $log: ng.ILogService, private $scope: ng.IScope, private $timeout: ng.ITimeoutService, private $stateParams: ng.ui.IStateParamsService, private threeDimensionalBoardService: ThreeDimensionalBoardService, private objService: ObjService, private webGLManagerService: WebGLManagerService) {
    }

    loadingValue;
    loadingText = '';
    loadingVisible = true;
    showMetrics = false;

    $onInit = () => {
        this.showMetrics = this.$stateParams['showMetrics'] === 'true';

        this.objService.downloadObjs().then(() => {
            this.webGLManagerService.initialize();
        }, null, state => {
            this.loadingValue = Math.floor((state.current / state.total) * 100);
            if (this.loadingValue === 100) {
                this.loadingText = 'done!'
                this.$timeout(1000).then(() => {
                    this.loadingVisible = false;
                });
            } else {
                this.loadingText = state.loadingText;
            }
        });
    }

}