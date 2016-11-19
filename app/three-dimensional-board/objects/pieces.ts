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

    protected _squareString: string;
    public get squareString(): string {
        return this._squareString;
    }

    constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, obj: Obj, pieceTeam: PieceTeam, squareString: string) {
        super(gl, shaderProgram, obj);
        this.pieceTeam = pieceTeam;
        this._squareString = squareString;
        this._location = squareToCoordsMap[squareString];

        if (this.pieceTeam === PieceTeam.Black && this.squareString === 'b8') {
            (<any>window).movePiece = (where) => {
                this.moveTo(where);
            };
        }
    }

    public moveTo(squareString: string, animationDuration = 2000) {
        this.originalLocation = this.location;
        this._squareString = squareString;
        this.animationStartTime = Date.now();
        this.animationDuration = 2000;
    }

    protected update() {
        const nowDate = Date.now();

        // if we're in the middle of an animation, update the location
        // to reflect the new position of this piece
        if (nowDate < this.animationStartTime + this.animationDuration) {
            const newX = easingFunctions.easeInOutCubic(nowDate - this.animationStartTime, this.originalLocation.elements[0], squareToCoordsMap[this.squareString].elements[0] - this.originalLocation.elements[0], this.animationDuration);
            const newY = this.originalLocation.elements[1];
            const newZ = easingFunctions.easeInOutCubic(nowDate - this.animationStartTime, this.originalLocation.elements[2], squareToCoordsMap[this.squareString].elements[2] - this.originalLocation.elements[2], this.animationDuration);

            this._location = $V([newX, newY, newZ]);
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
        const nowDate = Date.now();
        const halfWayDone = nowDate - this.animationStartTime >= this.animationDuration / 2;

        if (nowDate < this.animationStartTime + this.animationDuration) {
            const newX = easingFunctions.easeInOutExpo(nowDate - this.animationStartTime, this.originalLocation.elements[0], squareToCoordsMap[this.squareString].elements[0] - this.originalLocation.elements[0], this.animationDuration);
            const newZ = easingFunctions.easeInOutExpo(nowDate - this.animationStartTime, this.originalLocation.elements[2], squareToCoordsMap[this.squareString].elements[2] - this.originalLocation.elements[2], this.animationDuration);
            let newY: number;

            if (!halfWayDone) {
                console.log(nowDate - this.animationStartTime)
                newY = easingFunctions.easeOutExpo(nowDate - this.animationStartTime, this.originalLocation.elements[1], 4, this.animationDuration / 2);
            } else {
                console.log(nowDate - this.animationStartTime - (this.animationDuration / 2))
                newY = easingFunctions.easeInExpo(nowDate - this.animationStartTime - (this.animationDuration / 2), this.originalLocation.elements[1] + 4, -4, this.animationDuration / 2);
            }

            this._location = $V([newX, newY, newZ]);
        }
    }
}

// export class Knight extends ChessPiece {
//     type = PieceType.Knight;
//     private animationPhase: 'not animating' | 'rising' | 'moving' | 'falling' = 'not animating';
//     private userProvidedAnimationDuration: number;
//     private get liftAnimationDuration() { return 500; }
//     private get lifeAnimationHeight() { return 4; }

//     public moveTo(squareString: string, animationDuration = 1000) {
//         super.moveTo(squareString, animationDuration);

//         this.animationPhase = 'rising';
//         this.userProvidedAnimationDuration = animationDuration;
//         this.animationDuration = this.liftAnimationDuration;
//     }

//     // knights do a slightly different animation
//     protected update() {

//         if (this.animationPhase !== 'not animating') {

//             // if the previous animation is done, start the next phase
//             const nowDate = Date.now();
//             if (nowDate > this.animationStartTime + this.animationDuration) {
//                 this.originalLocation = this.location;

//                 if (this.animationPhase === 'rising') {
//                     this.animationPhase = 'moving';
//                     this.animationStartTime = nowDate;
//                     this.animationDuration = this.userProvidedAnimationDuration;
//                 } else if (this.animationPhase === 'moving') {
//                     this.animationPhase = 'falling';
//                     this.animationStartTime = nowDate;
//                     this.animationDuration = this.liftAnimationDuration;
//                 } else if (this.animationPhase === 'falling') {
//                     this.animationPhase = 'not animating';
//                 }
//             }

//             let newX: number, newY: number, newZ: number;

//             if (this.animationPhase === 'rising') {
//                 newX = this.originalLocation.elements[0]
//                 newY = easingFunctions.easeInCubic(nowDate - this.animationStartTime, this.originalLocation.elements[1], this.originalLocation.elements[1] + this.lifeAnimationHeight - this.originalLocation.elements[1], this.animationDuration);
//                 newZ = this.originalLocation.elements[2]
//             } else if (this.animationPhase === 'moving') {
//                 newX = easingFunctions.easeInOutSine(nowDate - this.animationStartTime, this.originalLocation.elements[0], squareToCoordsMap[this.squareString].elements[0] - this.originalLocation.elements[0], this.animationDuration);
//                 newY = easingFunctions.easeInOutSine(nowDate - this.animationStartTime, this.originalLocation.elements[1], squareToCoordsMap[this.squareString].elements[1] + this.lifeAnimationHeight - this.originalLocation.elements[1], this.animationDuration);
//                 newZ = easingFunctions.easeInOutSine(nowDate - this.animationStartTime, this.originalLocation.elements[2], squareToCoordsMap[this.squareString].elements[2] - this.originalLocation.elements[2], this.animationDuration);
//             } else if (this.animationPhase === 'falling') {
//                 newX = this.originalLocation.elements[0]
//                 newY = easingFunctions.easeOutCubic(nowDate - this.animationStartTime, this.originalLocation.elements[1], this.originalLocation.elements[1] - this.lifeAnimationHeight - this.originalLocation.elements[1], this.animationDuration);
//                 newZ = this.originalLocation.elements[2]
//             }

//             this._location = $V([newX, newY, newZ]);
//         }
//     }
// }

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