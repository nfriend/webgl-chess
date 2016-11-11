import { ThreeDimensionalBoardService } from './three-dimensional-board.service';

export class ThreeDimensionalBoardController {
    public static injectionName = 'WebGLChess.ThreeDimensionalBoardService';
    public static $inject = ['$log', ThreeDimensionalBoardService.injectionName];

    constructor(private $log: ng.ILogService, private threeDimensionalBoardService: ThreeDimensionalBoardService) {
    }
    
}