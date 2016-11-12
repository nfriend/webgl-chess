import { ThreeDimensionalBoardService } from './three-dimensional-board.service';
import { ObjService } from './obj-service/obj.service';

export class ThreeDimensionalBoardController {
    public static injectionName = 'WebGLChess.ThreeDimensionalBoardService';
    public static $inject = ['$log', '$timeout', ThreeDimensionalBoardService.injectionName, ObjService.injectionName];

    constructor(private $log: ng.ILogService, private $timeout: ng.ITimeoutService, private threeDimensionalBoardService: ThreeDimensionalBoardService, private objService: ObjService) {
    }

    loadingValue = 0;
    loadingText = '';
    loadingVisible = true;

    $onInit = () => {
        this.objService.downloadObjs().then(null, null, state => {
            this.loadingValue = (state.current / state.total) * 100;
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