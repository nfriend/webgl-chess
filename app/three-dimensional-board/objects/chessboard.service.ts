import * as Pieces from './pieces';
import { ObjService } from '../obj-service/obj.service';
import { Utility } from '../../utility/utility';
import { Square } from './square';
import { BaseObject } from './base-object';

export class ChessBoardService {

    public static injectionName = 'WebGLChess.ChessBoardService';
    public static $inject = ['$log', ObjService.injectionName];

    public pieces: Pieces.ChessPiece[] = [];
    public squares: Square[] = [];

    private gl: WebGLRenderingContext;
    private shaderProgram: WebGLProgram;

    constructor(private $log: ng.ILogService, private objService: ObjService) {
    }

    public initialize(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.initPieces();
    }

    private initPieces() {

        // black
        for (var i = 0; i < 8; i++) {
            this.pieces.push(new Pieces.Pawn(this.gl, this.shaderProgram, $V([-7 + (i * 2), 0, -5]), this.objService.objs['pawn'], Pieces.PieceTeam.Black));
        }

        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, $V([-7, 0, -7]), this.objService.objs['rook'], Pieces.PieceTeam.Black));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, $V([7, 0, -7]), this.objService.objs['rook'], Pieces.PieceTeam.Black));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, $V([-5, 0, -7]), this.objService.objs['knight'], Pieces.PieceTeam.Black));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, $V([5, 0, -7]), this.objService.objs['knight'], Pieces.PieceTeam.Black));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, $V([-3, 0, -7]), this.objService.objs['bishop'], Pieces.PieceTeam.Black));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, $V([3, 0, -7]), this.objService.objs['bishop'], Pieces.PieceTeam.Black));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, $V([-1, 0, -7]), this.objService.objs['queen'], Pieces.PieceTeam.Black));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, $V([1, 0, -7]), this.objService.objs['king'], Pieces.PieceTeam.Black));

        // all black pieces should be colored black and rotated 180 degrees
        this.pieces.forEach(p => {
            p.color = { r: 0, g: 0, b: 0, a: 1 };
            p.initialModelViewMatrix = Matrix.RotationY(Utility.degreesToRadians(180)).ensure4x4()
        });

        // white
        for (var i = 0; i < 8; i++) {
            this.pieces.push(new Pieces.Pawn(this.gl, this.shaderProgram, $V([-7 + (i * 2), 0, 5]), this.objService.objs['pawn'], Pieces.PieceTeam.White));
        }

        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, $V([-7, 0, 7]), this.objService.objs['rook'], Pieces.PieceTeam.White));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, $V([7, 0, 7]), this.objService.objs['rook'], Pieces.PieceTeam.White));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, $V([-5, 0, 7]), this.objService.objs['knight'], Pieces.PieceTeam.White));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, $V([5, 0, 7]), this.objService.objs['knight'], Pieces.PieceTeam.White));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, $V([-3, 0, 7]), this.objService.objs['bishop'], Pieces.PieceTeam.White));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, $V([3, 0, 7]), this.objService.objs['bishop'], Pieces.PieceTeam.White));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, $V([-1, 0, 7]), this.objService.objs['queen'], Pieces.PieceTeam.White));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, $V([1, 0, 7]), this.objService.objs['king'], Pieces.PieceTeam.White));

        // squares
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                const location = $V([-7 + 2 * i, 0, -7 + 2 * j]);
                const square = new Square(this.gl, this.shaderProgram, location, this.objService.objs['square']);
                square.color = (i + j) % 2 === 0 ? { r: 1, g: 1, b: 1, a: 1 } : { r: 0, g: 0, b: 0, a: 1 };
                this.squares.push(square);
            }
        }
    }

    public initializeShaders() {
        this.getAllObjects().forEach(p => {
            p.initializeShaders();
        });
    }

    public initializeBuffers() {
        this.getAllObjects().forEach(p => {
            p.initializeBuffers();
        });
    }

    public draw(projection: Matrix, modelView: Matrix) {
        this.getAllObjects().forEach(p => {
            p.draw(projection, modelView);
        });
    }

    private getAllObjects(): BaseObject[] {
        return (<BaseObject[]>this.pieces).concat(this.squares);
    }
}