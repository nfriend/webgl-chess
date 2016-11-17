import { Obj } from '../obj-service/obj-parser';
import { BaseObject } from './base-object';

export class ChessPiece extends BaseObject {
    public pieceTeam: PieceTeam;
    public type: PieceType; 

    constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, location: Vector, obj: Obj, pieceTeam: PieceTeam) {
        super(gl, shaderProgram, location, obj);

        this.pieceTeam = pieceTeam;
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

export enum PieceTeam {
    Black, White
}