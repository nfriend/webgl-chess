const vertexShader = require('raw!./shaders/shader.vs');
const fragmentShader = require('raw!./shaders/shader.fs');

export class WebGLManager {

    private shaderProgram: WebGLProgram;
    private vertexPositionAttribute: number;
    private vertexColorAttribute: number;
    private cubeVerticesBuffer: WebGLBuffer;
    private cubeVerticesColorBuffer: WebGLBuffer;
    private cubeVerticesIndexBuffer: WebGLBuffer;
    private cubeRotation = 500;
    private cubeXOffset = 0.0;
    private cubeYOffset = 0.0;
    private cubeZOffset = 0.0;
    private perspectiveMatrix: any;
    private mvMatrix;

    constructor(private gl: WebGLRenderingContext) {
    }

    public initialize() {
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
    }

    private initializeBuffers() {
        this.cubeVerticesBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesBuffer);

        const vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        const colors = [
            [1.0, 1.0, 1.0, 1.0],    // Front face: white
            [1.0, 0.0, 0.0, 1.0],    // Back face: red
            [0.0, 1.0, 0.0, 1.0],    // Top face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0]     // Left face: purple
        ];

        let generatedColors = [];
        colors.forEach(c => {
            for (let j = 0; j < 4; j++) {
                generatedColors = generatedColors.concat(c);
            }
        });

        this.cubeVerticesColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(generatedColors), this.gl.STATIC_DRAW);

        this.cubeVerticesIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);

        const cubeVertexIndices = [
            0, 1, 2, 0, 2, 3,           // front
            4, 5, 6, 4, 6, 7,           // back
            8, 9, 10, 8, 10, 11,        // top
            12, 13, 14, 12, 14, 15,     // bottom
            16, 17, 18, 16, 18, 19,     // right
            20, 21, 22, 20, 22, 23      // left
        ];

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);
    }

    private drawScene() {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
        this.loadIdentity();

        this.mvTranslate([-0.0, 0.0, -6.0]);
        this.mvRotate(this.cubeRotation, [1, 0, 1]);
        this.mvTranslate([this.cubeXOffset, this.cubeYOffset, this.cubeZOffset]);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesBuffer);
        this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
        this.gl.vertexAttribPointer(this.vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);

        var pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

        var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));

        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
    }

    private loadIdentity() {
        this.mvMatrix = Matrix.I(4);
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