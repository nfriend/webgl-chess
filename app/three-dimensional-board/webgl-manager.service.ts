import { ObjService } from './obj-service/obj.service';
import * as _ from 'lodash';

const vertexShader = require('raw!./shaders/shader.vs');
const fragmentShader = require('raw!./shaders/shader.fs');

export class WebGLManagerService {

    public static injectionName = 'WebGLChess.WebGLManagerService';
    public static $inject = [ObjService.injectionName];

    public gl: WebGLRenderingContext;

    private shaderProgram: WebGLProgram;
    private vertexPositionAttribute: number;
    private vertexColorAttribute: number;
    private vertexNormalAttribute: number;
    private cubeVerticesBuffer: WebGLBuffer;
    private cubeVerticesColorBuffer: WebGLBuffer;
    private cubeVerticesNormalBuffer: WebGLBuffer;
    private cubeVerticesIndexBuffer: WebGLBuffer;
    private cubeRotation = 250;
    private cubeXOffset = 0.0;
    private cubeYOffset = 0.0;
    private cubeZOffset = 0.0;
    private projectionMatrix: Matrix;
    private modelViewMatrix: Matrix;
    private normalMatrix: Matrix;

    constructor(private objService: ObjService) {
    }

    public initialize() {
        if (!this.gl) {
            throw WebGLManagerService.injectionName + ` must have its "gl" property set before calling initialize();`;
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color to black, fully opaque
        this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.

        this.initializeShaders();
        this.initializeBuffers();

        this.drawScene();
    }

    private initializeShaders(): void {
        let shaderSources = [
            { type: this.gl.VERTEX_SHADER, source: vertexShader, friendlyName: 'vertex' },
            { type: this.gl.FRAGMENT_SHADER, source: fragmentShader, friendlyName: 'fragment' }
        ];

        this.shaderProgram = this.gl.createProgram();

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

        this.gl.useProgram(this.shaderProgram);

        this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexPosition');
        this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
        this.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexColor');
        this.gl.enableVertexAttribArray(this.vertexColorAttribute);
        this.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexNormal');
        this.gl.enableVertexAttribArray(this.vertexNormalAttribute);
    }

    private initializeBuffers() {

        const colors = [];
        for (var i = 0; i < this.objService.objs['pawn'].renderData.vertexCoords.length / 3 * 4; i++) {
            colors.push(0.0);
        }

        this.cubeVerticesBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.objService.objs['pawn'].renderData.vertexCoords), this.gl.STATIC_DRAW);

        this.cubeVerticesColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        this.cubeVerticesNormalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesNormalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.objService.objs['pawn'].renderData.vertexNormals), this.gl.STATIC_DRAW);

        this.cubeVerticesIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.objService.objs['pawn'].renderData.vertexIndices), this.gl.STATIC_DRAW);
    }

    private drawScene() {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.projectionMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
        this.modelViewMatrix = Matrix.I(4);

        this.mvTranslate([0.0, -1.0, -3.0]);
        //this.mvRotate(this.cubeRotation, [1, 0, 1]);
        this.mvTranslate([this.cubeXOffset, this.cubeYOffset, this.cubeZOffset]);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesBuffer);
        this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
        this.gl.vertexAttribPointer(this.vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesNormalBuffer);
        this.gl.vertexAttribPointer(this.vertexNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);

        let projectionUniform = this.gl.getUniformLocation(this.shaderProgram, "projectionMatrix");
        this.gl.uniformMatrix4fv(projectionUniform, false, new Float32Array(this.projectionMatrix.flatten()));

        let modelViewUniform = this.gl.getUniformLocation(this.shaderProgram, "modelViewMatrix");
        this.gl.uniformMatrix4fv(modelViewUniform, false, new Float32Array(this.modelViewMatrix.flatten()));

        let normalUniform = this.gl.getUniformLocation(this.shaderProgram, "normalMatrix");
        this.gl.uniformMatrix4fv(normalUniform, false, new Float32Array(this.modelViewMatrix.inverse().transpose().flatten()));

        this.gl.drawElements(this.gl.TRIANGLES, this.objService.objs['pawn'].rawData.faces.length * 3, this.gl.UNSIGNED_SHORT, 0);
    }

    private multMatrix(m) {
        this.modelViewMatrix = this.modelViewMatrix.x(m);
    }

    private mvTranslate(v) {
        this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
    }

    private mvRotate(angle, v) {
        let inRadians = angle * Math.PI / 180.0;

        let m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
        this.multMatrix(m);
    }

}