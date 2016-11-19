import * as Pieces from './pieces';
import { AssetService } from '../obj-service/obj.service';
import { Utility } from '../../utility/utility';
import { Square } from './square';
import { BaseObject } from './base-object';
import { squareToCoordsMap } from '../square-to-coords-map';
import { StockfishService } from '../../stockfish/stockfish.service';
import { ChessJsService } from '../../chessjs/chessjs.service';

console.log(squareToCoordsMap)

export class ChessBoardService {

    public static injectionName = 'WebGLChess.ChessBoardService';
    public static $inject = ['$log', AssetService.injectionName, StockfishService.injectionName, ChessJsService.injectionName];

    public pieces: Pieces.ChessPiece[] = [];
    public squares: Square[] = [];

    private gl: WebGLRenderingContext;
    private shaderProgram: WebGLProgram;

    constructor(private $log: ng.ILogService, private assetService: AssetService, private stockfishService: StockfishService, private chessJsService: ChessJsService) {
    }

    public initialize(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.initPieces();

        //setTimeout(() => { this.executeNextMove(); }, 200);
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

        const lightWood = this.assetService.textures['lightWood'];
        const darkWood = this.assetService.textures['darkWood'];

        // black
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter, index) => {
            const pawn = new Pieces.Pawn(this.gl, this.shaderProgram, this.assetService.objs['pawnDark'], darkWood, Pieces.PieceTeam.Black, letter + '7')
            
            // orient the pawn differently so they don't all look identical
            pawn.initialModelViewMatrix = Matrix.RotationY(Utility.degreesToRadians((Math.floor(Math.random() * 360)))).ensure4x4();

            this.pieces.push(pawn);
        });

        /*
        const darkRook1 = new Pieces.Rook(this.gl, this.shaderProgram, this.assetService.objs['rook'], lightWood, Pieces.PieceTeam.Black, 'a8');
        const darkRook2 = new Pieces.Rook(this.gl, this.shaderProgram, this.assetService.objs['rook'], lightWood, Pieces.PieceTeam.Black, 'h8');

        const darkKnight1 = new Pieces.Knight(this.gl, this.shaderProgram, this.assetService.objs['knight'], lightWood, Pieces.PieceTeam.Black, 'b8');
        const darkKnight2 = new Pieces.Knight(this.gl, this.shaderProgram, this.assetService.objs['knight'], lightWood, Pieces.PieceTeam.Black, 'g8');

        const darkBishop1 = new Pieces.Bishop(this.gl, this.shaderProgram, this.assetService.objs['bishop'], lightWood, Pieces.PieceTeam.Black, 'c8');
        const darkBishop2 = new Pieces.Bishop(this.gl, this.shaderProgram, this.assetService.objs['bishop'], lightWood, Pieces.PieceTeam.Black, 'f8');

        const darkQueen = new Pieces.Queen(this.gl, this.shaderProgram, this.assetService.objs['queen'], lightWood, Pieces.PieceTeam.Black, 'd8');

        const darkKing = new Pieces.King(this.gl, this.shaderProgram, this.assetService.objs['king'], lightWood, Pieces.PieceTeam.Black, 'e8');

        // these dark pieces should be rotated 180 degrees
        [darkKnight1, darkKnight2, darkBishop1, darkBishop2].forEach(p => {
            p.initialModelViewMatrix = Matrix.RotationY(Utility.degreesToRadians(180)).ensure4x4()
        });
        */

        // white
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(letter => {
            const pawn = new Pieces.Pawn(this.gl, this.shaderProgram, this.assetService.objs['pawnLight'], lightWood, Pieces.PieceTeam.White, letter + '2');

            // orient the pawn differently so they don't all look identical
            pawn.initialModelViewMatrix = Matrix.RotationY(Utility.degreesToRadians((Math.floor(Math.random() * 360)))).ensure4x4();

            this.pieces.push(pawn);
        });

        /*

        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.assetService.objs['rook'], lightWood, Pieces.PieceTeam.White, 'a1'));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.assetService.objs['rook'], lightWood, Pieces.PieceTeam.White, 'h1'));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.assetService.objs['knight'], lightWood, Pieces.PieceTeam.White, 'b1'));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.assetService.objs['knight'], lightWood, Pieces.PieceTeam.White, 'g1'));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.assetService.objs['bishop'], lightWood, Pieces.PieceTeam.White, 'c1'));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.assetService.objs['bishop'], lightWood, Pieces.PieceTeam.White, 'f1'));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, this.assetService.objs['queen'], lightWood, Pieces.PieceTeam.White, 'd1'));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, this.assetService.objs['king'], lightWood, Pieces.PieceTeam.White, 'e1'));

        // squares
        for (let number = 8; number > 0; number--) {
            ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter, letterIndex) => {
                const color = (number + letterIndex) % 2 === 0 ? { r: 1, g: 1, b: 1, a: 1 } : { r: 0, g: 0, b: 0, a: 1 };
                const square = new Square(this.gl, this.shaderProgram, this.assetService.objs['square'], lightWood, letter + number, color);
                this.squares.push(square);
            });
        }

        */
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