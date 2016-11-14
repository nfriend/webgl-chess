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
    private perspectiveMatrix: Matrix;
    private mvMatrix: Matrix;

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

        this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
        this.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor');
        this.gl.enableVertexAttribArray(this.vertexColorAttribute);
        this.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexNormal');
        this.gl.enableVertexAttribArray(this.vertexNormalAttribute);
    }

    private initializeBuffers() {
        this.cubeVerticesBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesBuffer);
        const vertices = _.flatten(this.objService.objs['pawn'].vertices.map(v => [v.x, v.y, v.z]));
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        console.log(vertices)

        let generatedColors = [];
        for (var i = 0; i < vertices.length * 3; i++) {
            generatedColors = generatedColors.concat([0.0, 0.0, 0.0, 0.0]);
        };

        this.cubeVerticesColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(generatedColors), this.gl.STATIC_DRAW);

        this.cubeVerticesNormalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesNormalBuffer);
        const normals = _.flatten(this.objService.objs['pawn'].vertexNormals.map(v => [v.x, v.y, v.z]));
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);

        console.log(normals)

        this.cubeVerticesIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);

        const cubeVertexIndices = [];
        this.objService.objs['pawn'].faces.forEach(f => {
            f.vertices.forEach(v => {
                cubeVertexIndices.push(v.vertexIndex - 1);
            });
        });

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);
    }

    private drawScene() {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
        this.mvMatrix = Matrix.I(4);

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

        var pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

        var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));

        this.gl.drawElements(this.gl.TRIANGLES, this.objService.objs['pawn'].faces.length * 3, this.gl.UNSIGNED_SHORT, 0);
    }

    private multMatrix(m) {
        this.mvMatrix = this.mvMatrix.x(m);
    }

    private mvTranslate(v) {
        this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
    }

    private mvRotate(angle, v) {
        var inRadians = angle * Math.PI / 180.0;

        var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
        this.multMatrix(m);
    }

}