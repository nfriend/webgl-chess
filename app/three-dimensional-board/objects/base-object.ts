import { Obj } from '../obj-service/obj-parser';
import { Renderable } from './renderable';
import { Light } from './light';

export abstract class BaseObject implements Renderable {

    public color: { r: number, g: number, b: number, a: number } = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
    protected texture: WebGLTexture;

    // the current location of this piece
    protected _location: Vector = $V([0, 0, 0]);
    public get location(): Vector {
        return this._location;
    }

    public initialModelViewMatrix = Matrix.I(4);

    private vertexPositionAttribute: number;
    private vertexColorAttribute: number;
    private vertexNormalAttribute: number;
    private vertexTextureCoordsAttribute: number;
    private vertexTangentAttribute: number;
    private vertexBitangentAttribute: number;

    private vertexPositionBuffer: WebGLBuffer;
    private vertexColorBuffer: WebGLBuffer;
    private vertexNormalBuffer: WebGLBuffer;
    private verticesIndexBuffer: WebGLBuffer;
    private vertexTextureCoordsBuffer: WebGLBuffer;
    private vertexTangentBuffer: WebGLBuffer;
    private vertexBitangentBuffer: WebGLBuffer;

    constructor(private gl: WebGLRenderingContext, private shaderProgram: WebGLProgram, protected obj: Obj, protected textureImage?: HTMLImageElement) {
    }

    public initializeShaders() {
        this.gl.useProgram(this.shaderProgram);

        this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexPosition');
        this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
        this.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexColor');
        this.gl.enableVertexAttribArray(this.vertexColorAttribute);
        this.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexNormal');
        this.gl.enableVertexAttribArray(this.vertexNormalAttribute);
        this.vertexTextureCoordsAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexTextureCoords');
        this.gl.enableVertexAttribArray(this.vertexTextureCoordsAttribute);
        this.vertexTangentAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexTangent');
        this.gl.enableVertexAttribArray(this.vertexTangentAttribute);
        this.vertexBitangentAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexBitangent');
        this.gl.enableVertexAttribArray(this.vertexBitangentAttribute);
    }

    public initializeBuffers() {
        this.gl.useProgram(this.shaderProgram);

        let colors = [];
        for (var i = 0; i < this.obj.renderData.vertexCoords.length / 3; i++) {
            colors.push(this.color.r, this.color.g, this.color.b, this.color.a);
        }

        this.vertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.obj.renderData.vertexCoords), this.gl.STATIC_DRAW);

        this.vertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        this.vertexNormalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.obj.renderData.vertexNormals), this.gl.STATIC_DRAW);

        this.vertexTextureCoordsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.obj.renderData.textureCoords), this.gl.STATIC_DRAW);

        this.vertexTangentBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTangentBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.obj.renderData.vertexTangents), this.gl.STATIC_DRAW);

        this.vertexBitangentBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBitangentBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.obj.renderData.vertexBitangents), this.gl.STATIC_DRAW);

        this.verticesIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.obj.renderData.vertexIndices), this.gl.STATIC_DRAW);

        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureImage);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    public draw(projection: Matrix, modelView: Matrix, lights: Light[]) {
        this.update();

        this.gl.useProgram(this.shaderProgram);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        this.gl.vertexAttribPointer(this.vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        this.gl.vertexAttribPointer(this.vertexNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTextureCoordsBuffer);
        this.gl.vertexAttribPointer(this.vertexTextureCoordsAttribute, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexTangentBuffer);
        this.gl.vertexAttribPointer(this.vertexTangentAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBitangentBuffer);
        this.gl.vertexAttribPointer(this.vertexBitangentAttribute, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);

        let projectionUniform = this.gl.getUniformLocation(this.shaderProgram, 'projectionMatrix');
        this.gl.uniformMatrix4fv(projectionUniform, false, new Float32Array(projection.flatten()));

        let modelViewUniform = this.gl.getUniformLocation(this.shaderProgram, 'modelViewMatrix');
        let translatedMatrix = modelView.multiply(Matrix.Translation(this.location).ensure4x4()).multiply(this.initialModelViewMatrix);
        this.gl.uniformMatrix4fv(modelViewUniform, false, new Float32Array(translatedMatrix.flatten()));

        let normalUniform = this.gl.getUniformLocation(this.shaderProgram, 'normalMatrix');
        this.gl.uniformMatrix4fv(normalUniform, false, new Float32Array(translatedMatrix.inverse().transpose().flatten()));

        lights.forEach((light, index) => {
            Object.keys(light).forEach(prop => {
                let propLocation = this.gl.getUniformLocation(this.shaderProgram, `lights[${index}].${prop}`);
                this.gl.uniform3f(propLocation, light[prop].elements[0], light[prop].elements[1], light[prop].elements[2]);
            });
        });

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "sampler"), 0);

        this.gl.drawElements(this.gl.TRIANGLES, this.obj.rawData.faces.length * 3, this.gl.UNSIGNED_SHORT, 0);
    }

    protected update() {

    }
}