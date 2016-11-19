import * as Pieces from './pieces';
import { ObjService } from '../obj-service/obj.service';
import { Utility } from '../../utility/utility';
import { Square } from './square';
import { BaseObject } from './base-object';
import { squareToCoordsMap } from '../square-to-coords-map';
import { StockfishService } from '../../stockfish/stockfish.service';
import { ChessJsService } from '../../chessjs/chessjs.service';

console.log(squareToCoordsMap)

export class ChessBoardService {

    public static injectionName = 'WebGLChess.ChessBoardService';
    public static $inject = ['$log', ObjService.injectionName, StockfishService.injectionName, ChessJsService.injectionName];

    public pieces: Pieces.ChessPiece[] = [];
    public squares: Square[] = [];

    private gl: WebGLRenderingContext;
    private shaderProgram: WebGLProgram;

    constructor(private $log: ng.ILogService, private objService: ObjService, private stockfishService: StockfishService, private chessJsService: ChessJsService) {
    }

    public initialize(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.initPieces();

        setTimeout(() => { this.executeNextMove(); }, 200);
    }

    private executeNextMove() {
        this.stockfishService.executeNextMove(this.chessJsService.chess).then(move => {
            const pieceToMove = this.pieces.filter(p => p.squareString === move.from)[0];
            this.pieces = this.pieces.filter(p => p.squareString !== move.to);

            if (move.flags.indexOf('k') !== -1) {
                if (move.color === 'w') {
                    this.pieces.filter(p => p.squareString === 'h1')[0].moveTo('f1', 'hop');
                } else {
                    this.pieces.filter(p => p.squareString === 'h8')[0].moveTo('f8', 'hop');
                }
            }

            if (move.flags.indexOf('q') !== -1) {
                if (move.color === 'w') {
                    this.pieces.filter(p => p.squareString === 'a1')[0].moveTo('d1', 'hop');
                } else {
                    this.pieces.filter(p => p.squareString === 'a8')[0].moveTo('d8', 'hop');
                }
            }

            pieceToMove.moveTo(move.to);
            setTimeout(() => { this.executeNextMove(); }, 2000);
        });
    }

    private initPieces() {

        // black
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(letter => {
            this.pieces.push(new Pieces.Pawn(this.gl, this.shaderProgram, this.objService.objs['pawn'], Pieces.PieceTeam.Black, letter + '7'));
        });

        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.objService.objs['rook'], Pieces.PieceTeam.Black, 'a8'));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.objService.objs['rook'], Pieces.PieceTeam.Black, 'h8'));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.objService.objs['knight'], Pieces.PieceTeam.Black, 'b8'));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.objService.objs['knight'], Pieces.PieceTeam.Black, 'g8'));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.objService.objs['bishop'], Pieces.PieceTeam.Black, 'c8'));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.objService.objs['bishop'], Pieces.PieceTeam.Black, 'f8'));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, this.objService.objs['queen'], Pieces.PieceTeam.Black, 'd8'));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, this.objService.objs['king'], Pieces.PieceTeam.Black, 'e8'));

        // all black pieces should be colored black and rotated 180 degrees
        this.pieces.forEach(p => {
            p.color = { r: 0, g: 0, b: 0, a: 1 };
            p.initialModelViewMatrix = Matrix.RotationY(Utility.degreesToRadians(180)).ensure4x4()
        });

        // white
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(letter => {
            this.pieces.push(new Pieces.Pawn(this.gl, this.shaderProgram, this.objService.objs['pawn'], Pieces.PieceTeam.White, letter + '2'));
        });

        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.objService.objs['rook'], Pieces.PieceTeam.White, 'a1'));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.objService.objs['rook'], Pieces.PieceTeam.White, 'h1'));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.objService.objs['knight'], Pieces.PieceTeam.White, 'b1'));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.objService.objs['knight'], Pieces.PieceTeam.White, 'g1'));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.objService.objs['bishop'], Pieces.PieceTeam.White, 'c1'));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.objService.objs['bishop'], Pieces.PieceTeam.White, 'f1'));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, this.objService.objs['queen'], Pieces.PieceTeam.White, 'd1'));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, this.objService.objs['king'], Pieces.PieceTeam.White, 'e1'));

        // squares
        for (let number = 8; number > 0; number--) {
            ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter, letterIndex) => {
                const color = (number + letterIndex) % 2 === 0 ? { r: 1, g: 1, b: 1, a: 1 } : { r: 0, g: 0, b: 0, a: 1 };
                const square = new Square(this.gl, this.shaderProgram, this.objService.objs['square'], letter + number, color);
                this.squares.push(square);
            });
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