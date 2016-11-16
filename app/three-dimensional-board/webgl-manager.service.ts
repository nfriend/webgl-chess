import { ObjService } from './obj-service/obj.service';
import * as _ from 'lodash';
import { ChessBoardService } from './objects/chessboard.service';
import { Utility } from '../utility/utility';
import { CameraControls } from './camera-controls';

const vertexShader = require('raw!./shaders/shader.vs');
const fragmentShader = require('raw!./shaders/shader.fs');

export class WebGLManagerService {

    public static injectionName = 'WebGLChess.WebGLManagerService';
    public static $inject = [ObjService.injectionName, ChessBoardService.injectionName];

    public gl: WebGLRenderingContext;

    private shaderProgram: WebGLProgram;
    private vertexPositionAttribute: number;
    private vertexColorAttribute: number;
    private vertexNormalAttribute: number;
    private cubeVerticesBuffer: WebGLBuffer;
    private cubeVerticesColorBuffer: WebGLBuffer;
    private cubeVerticesNormalBuffer: WebGLBuffer;
    private cubeVerticesIndexBuffer: WebGLBuffer;
    private projectionMatrix: Matrix;
    private modelViewMatrix: Matrix;
    private normalMatrix: Matrix;

    private width: number;
    private height: number;
    private cameraControls = new CameraControls();

    constructor(private objService: ObjService, private chessBoard: ChessBoardService) {
    }

    public initialize() {
        if (!this.gl) {
            throw WebGLManagerService.injectionName + ` must have its "gl" property set before calling initialize();`;
        }

        // setup the viewport dimensions
        const viewPort = this.gl.getParameter(this.gl.VIEWPORT);
        this.width = viewPort[2];
        this.height = viewPort[3];

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // background color
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // clear the color and depth buffer

        let shaderSources = [
            { type: this.gl.VERTEX_SHADER, source: vertexShader, friendlyName: 'vertex' },
            { type: this.gl.FRAGMENT_SHADER, source: fragmentShader, friendlyName: 'fragment' }
        ];

        this.shaderProgram = this.gl.createProgram();

        // compile all the shaders
        shaderSources.forEach(ss => {
            let shader = this.gl.createShader(ss.type);
            this.gl.shaderSource(shader, ss.source);
            this.gl.compileShader(shader);
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                console.error('An error occurred while compiling the ' + ss.friendlyName + ' shader: ' + this.gl.getShaderInfoLog(shader));
            } else {
                this.gl.attachShader(this.shaderProgram, shader);
            }
        });

        this.gl.linkProgram(this.shaderProgram);

        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.shaderProgram));
        }

        this.chessBoard.initialize(this.gl, this.shaderProgram);
        this.chessBoard.initializeShaders();
        this.chessBoard.initializeBuffers();

        this.cameraControls.startListening(angular.element(document));

        this.animate();
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    private drawScene() {
        this.cameraControls.update();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.projectionMatrix = makePerspective(45, this.width / this.height, 0.1, 100.0);
        this.modelViewMatrix = this.cameraControls.getViewMatrix();
        this.chessBoard.draw(this.projectionMatrix, this.modelViewMatrix, this.modelViewMatrix.inverse().transpose());
    }

    private animate() {
        this.drawScene();
        requestAnimationFrame(() => {
            this.animate();
        });
    }
}