import { Obj } from '../obj-service/obj-parser';
import { BaseObject } from './base-object';
import { squareToCoordsMap } from '../square-to-coords-map';
import { easingFunctions } from '../../utility/easing-functions';

export class ChessPiece extends BaseObject {
    public pieceTeam: PieceTeam;
    public type: PieceType;

    // the original location of the piece for using while animating
    protected originalLocation: Vector;
    protected animationStartTime: number = 0;
    protected animationDuration: number = 1000;
    protected isAnimating: boolean = false;

    protected _squareString: string;
    public get squareString(): string {
        return this._squareString;
    }

    constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, obj: Obj, pieceTeam: PieceTeam, squareString: string) {
        super(gl, shaderProgram, obj);
        this.pieceTeam = pieceTeam;
        this._squareString = squareString;
        this._location = squareToCoordsMap[squareString];
    }

    public moveTo(squareString: string, animationDuration = 2000) {
        this.originalLocation = this.location;
        this._squareString = squareString;
        this.animationStartTime = Date.now();
        this.animationDuration = animationDuration;
        this.isAnimating = true;
    }

    protected update() {
        if (!this.isAnimating) {
            return;
        }

        const currentStep = Math.min(Date.now() - this.animationStartTime, this.animationDuration);

        const newX = easingFunctions.easeInOutCubic(currentStep, this.originalLocation.elements[0], squareToCoordsMap[this.squareString].elements[0] - this.originalLocation.elements[0], this.animationDuration);
        const newY = this.originalLocation.elements[1];
        const newZ = easingFunctions.easeInOutCubic(currentStep, this.originalLocation.elements[2], squareToCoordsMap[this.squareString].elements[2] - this.originalLocation.elements[2], this.animationDuration);

        this._location = $V([newX, newY, newZ]);

        if (currentStep === this.animationDuration) {
            this.isAnimating = false;
        }
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

    // knights do a slightly different animation
    protected update() {
        if (!this.isAnimating) {
            return;
        }

        const currentStep = Math.min(Date.now() - this.animationStartTime, this.animationDuration);

        const newX = easingFunctions.easeInOutCubic(currentStep, this.originalLocation.elements[0], squareToCoordsMap[this.squareString].elements[0] - this.originalLocation.elements[0], this.animationDuration);
        const newZ = easingFunctions.easeInOutCubic(currentStep, this.originalLocation.elements[2], squareToCoordsMap[this.squareString].elements[2] - this.originalLocation.elements[2], this.animationDuration);
        let newY: number;

        const halfWayDone = currentStep >= this.animationDuration / 2;
        if (!halfWayDone) {
            newY = easingFunctions.easeOutCubic(currentStep, this.originalLocation.elements[1], 4, this.animationDuration / 2);
        } else {
            newY = easingFunctions.easeInCubic(currentStep - (this.animationDuration / 2), this.originalLocation.elements[1] + 4, -4, this.animationDuration / 2);
        }

        this._location = $V([newX, newY, newZ]);
    }
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