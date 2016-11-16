import * as Pieces from './pieces';
import { ObjService } from '../obj-service/obj.service';

export class ChessBoardService {

    public static injectionName = 'WebGLChess.ChessBoardService';
    public static $inject = ['$log', ObjService.injectionName];

    public pieces: Pieces.ChessPiece[] = [];

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
            this.pieces.push(new Pieces.Pawn(this.gl, this.shaderProgram, $V([-7 + (i * 2), 0, -5]), this.objService.objs['pawn'], Pieces.PieceColor.Black));
        }

        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, $V([-7, 0, -7]), this.objService.objs['rook'], Pieces.PieceColor.Black));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, $V([7, 0, -7]), this.objService.objs['rook'], Pieces.PieceColor.Black));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, $V([-5, 0, -7]), this.objService.objs['knight'], Pieces.PieceColor.Black));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, $V([5, 0, -7]), this.objService.objs['knight'], Pieces.PieceColor.Black));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, $V([-3, 0, -7]), this.objService.objs['bishop'], Pieces.PieceColor.Black));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, $V([3, 0, -7]), this.objService.objs['bishop'], Pieces.PieceColor.Black));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, $V([-1, 0, -7]), this.objService.objs['queen'], Pieces.PieceColor.Black));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, $V([1, 0, -7]), this.objService.objs['king'], Pieces.PieceColor.Black));

        // white
        for (var i = 0; i < 8; i++) {
            this.pieces.push(new Pieces.Pawn(this.gl, this.shaderProgram, $V([-7 + (i * 2), 0, 5]), this.objService.objs['pawn'], Pieces.PieceColor.White));
        }
        
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, $V([-7, 0, 7]), this.objService.objs['rook'], Pieces.PieceColor.White));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, $V([7, 0, 7]), this.objService.objs['rook'], Pieces.PieceColor.White));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, $V([-5, 0, 7]), this.objService.objs['knight'], Pieces.PieceColor.White));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, $V([5, 0, 7]), this.objService.objs['knight'], Pieces.PieceColor.White));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, $V([-3, 0, 7]), this.objService.objs['bishop'], Pieces.PieceColor.White));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, $V([3, 0, 7]), this.objService.objs['bishop'], Pieces.PieceColor.White));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, $V([-1, 0, 7]), this.objService.objs['queen'], Pieces.PieceColor.White));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, $V([1, 0, 7]), this.objService.objs['king'], Pieces.PieceColor.White));
    }

    public initializeShaders() {
        this.pieces.forEach(p => {
            p.initializeShaders();
        });
    }

    public initializeBuffers() {
        this.pieces.forEach(p => {
            p.initializeBuffers();
        });
    }

    public draw(projection: Matrix, modelView: Matrix) {
        this.pieces.forEach(p => {
            p.draw(projection, modelView);
        });
    }
}