import { ThreeDimensionalBoardController } from './three-dimensional-board.controller';
import { WebGLManager } from './webgl-manager';

export class ThreeDimensionalBoardDirective {
    public static injectionName = 'threeDimensionalBoard';
    public static $inject = ['$window'];
    public template = require('./three-dimensional-board.html');
    public controller = ThreeDimensionalBoardController;
    public bindToController = true;
    public controllerAs = 'vm';
    public scope = {};

    private $window: JQuery; 
    private canvas: HTMLCanvasElement;

    constructor(private windowService: ng.IWindowService) {
        this.$window = angular.element(windowService);
    }

    public link = ($scope: ng.IScope, $element: JQuery, attrs: ng.IAttributes, ctrl: ThreeDimensionalBoardController) => {
        this.canvas = <HTMLCanvasElement>$element.find('canvas')[0];
        this.resizeCanvas();
        const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

        if (!gl) {
            console.log('Unable to intialize WebGL!  Your browser may not support it.');
        }

        let manager = new WebGLManager(gl);
        manager.initialize();

        this.$window.on('resize', this.resizeCanvas);
        $scope.$on('$destroy', () => {
            this.$window.off('resize', this.resizeCanvas);
        });
    }

    private resizeCanvas = () => {
        const width = this.$window.outerWidth();
        const height = this.$window.outerHeight();
        this.canvas.width = width;
        this.canvas.height = height;
        // this.canvas.style.width = width + 'px';
        // this.canvas.style.height = height + 'px';   
    }
}