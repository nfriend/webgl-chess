import { ThreeDimensionalBoardService } from './three-dimensional-board.service';
import { ObjService } from './obj-service/obj.service';

export class ThreeDimensionalBoardController {
    public static injectionName = 'WebGLChess.ThreeDimensionalBoardService';
    public static $inject = ['$log', ThreeDimensionalBoardService.injectionName, ObjService.injectionName];

    constructor(private $log: ng.ILogService, private threeDimensionalBoardService: ThreeDimensionalBoardService, private objService: ObjService) {
    }

    $onInit = () => {
        this.objService.downloadObjs();
    }

}