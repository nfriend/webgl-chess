import { ThreeDimensionalBoardController } from './three-dimensional-board.controller';
import { WebGLManagerService } from './webgl-manager.service';

export class ThreeDimensionalBoardDirective {
    public static injectionName = 'threeDimensionalBoard';
    public static $inject = ['$window', WebGLManagerService.injectionName];
    public template = require('./three-dimensional-board.html');
    public controller = ThreeDimensionalBoardController;
    public bindToController = true;
    public controllerAs = 'vm';
    public scope = {};

    private $window: JQuery; 
    private canvas: HTMLCanvasElement;

    constructor(private windowService: ng.IWindowService, private webglManagerService: WebGLManagerService) {
        this.$window = angular.element(windowService);
    }

    public link = ($scope: ng.IScope, $element: JQuery, attrs: ng.IAttributes, ctrl: ThreeDimensionalBoardController) => {
        this.canvas = <HTMLCanvasElement>$element.find('canvas.chessboard-canvas')[0];
        this.resizeCanvas();
        const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        if (!gl) {
            console.log('Unable to intialize WebGL!  Your browser may not support it.');
        }

        this.webglManagerService.gl = gl;

        this.$window.on('resize', this.onWindowResize);
        $scope.$on('$destroy', () => {
            this.$window.off('resize', this.onWindowResize);
        });
    }

    private resizeCanvas = () => {
        const width = this.$window.outerWidth();
        const height = this.$window.outerHeight();
        this.canvas.width = width;
        this.canvas.height = height;
        return { width, height };
    }   

    private onWindowResize = () => {
        const { width, height } = this.resizeCanvas();
        this.webglManagerService.resize(width, height);   
    }
}