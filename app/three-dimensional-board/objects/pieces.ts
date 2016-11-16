import { Obj } from '../obj-service/obj-parser';
import { Utility } from '../../utility/utility';

export abstract class ChessPiece {
    public type: PieceType; 

    private vertexPositionAttribute: number;
    private vertexColorAttribute: number;
    private vertexNormalAttribute: number;

    private vertexPositionBuffer: WebGLBuffer;
    private vertexColorBuffer: WebGLBuffer;
    private vertexNormalBuffer: WebGLBuffer;
    private verticesIndexBuffer: WebGLBuffer;

    constructor(private gl: WebGLRenderingContext, private shaderProgram: WebGLProgram, public location: Vector, public obj: Obj, public color: PieceColor) {
    }

    public initializeShaders() {
        this.gl.useProgram(this.shaderProgram);

        this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexPosition');
        this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
        this.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexColor');
        this.gl.enableVertexAttribArray(this.vertexColorAttribute);
        this.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, 'vertexNormal');
        this.gl.enableVertexAttribArray(this.vertexNormalAttribute);
    }

    public initializeBuffers() {
        this.gl.useProgram(this.shaderProgram);

        const colors = [];
        for (var i = 0; i < this.obj.renderData.vertexCoords.length / 3 * 4; i++) {
            colors.push(this.color === PieceColor.Black ? 0.0 : 1.0);
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

        this.verticesIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.obj.renderData.vertexIndices), this.gl.STATIC_DRAW);
    }

    public draw(projection: Matrix, modelView: Matrix) {
        this.gl.useProgram(this.shaderProgram);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        this.gl.vertexAttribPointer(this.vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        this.gl.vertexAttribPointer(this.vertexNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.verticesIndexBuffer);

        let projectionUniform = this.gl.getUniformLocation(this.shaderProgram, 'projectionMatrix');
        this.gl.uniformMatrix4fv(projectionUniform, false, new Float32Array(projection.flatten()));

        let modelViewUniform = this.gl.getUniformLocation(this.shaderProgram, 'modelViewMatrix');
        let rotationMatrix = this.color === PieceColor.Black ? Matrix.RotationY(Utility.degreesToRadians(180)).ensure4x4() : Matrix.I(4);
        let translatedMatrix = modelView.multiply(Matrix.Translation(this.location).ensure4x4()).multiply(rotationMatrix);
        this.gl.uniformMatrix4fv(modelViewUniform, false, new Float32Array(translatedMatrix.flatten()));

        let normalUniform = this.gl.getUniformLocation(this.shaderProgram, 'normalMatrix');
        this.gl.uniformMatrix4fv(normalUniform, false, new Float32Array(translatedMatrix.inverse().transpose().flatten()));

        this.gl.drawElements(this.gl.TRIANGLES, this.obj.rawData.faces.length * 3, this.gl.UNSIGNED_SHORT, 0);
    }
}

export class Pawn extends ChessPiece {
    type = PieceType.Pawn;
}

export class Rook extends ChessPiece {
    type = PieceType.Rook;
}

export class Knight extends ChessPiece {
    type = PieceType.Knight;
}

export class Bishop extends ChessPiece {
    type = PieceType.Bishop;
}

export class Queen extends ChessPiece {
    type = PieceType.Queen;
}

export class King extends ChessPiece {
    type = PieceType.King;
}

export enum PieceType {
    Pawn, Rook, Knight, Bishop, Queen, King
}

export enum PieceColor {
    Black, White
}