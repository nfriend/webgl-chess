import * as Pieces from './pieces';
import { AssetService } from '../obj-service/obj.service';
import { Utility } from '../../utility/utility';
import { Square } from './square';
import { Border } from './border';
import { BaseObject } from './base-object';
import { squareToCoordsMap } from '../square-to-coords-map';
import { StockfishService } from '../../stockfish/stockfish.service';
import { ChessJsService } from '../../chessjs/chessjs.service';
import { Renderable } from './renderable';
import { Light } from './light';

export class ChessBoardService {

    public static injectionName = 'WebGLChess.ChessBoardService';
    public static $inject = ['$log', '$rootScope', AssetService.injectionName, StockfishService.injectionName, ChessJsService.injectionName];

    public pieces: Pieces.ChessPiece[] = [];
    public squares: Square[] = [];
    public border: Border;
    public lights: Light[] = [];

    private gl: WebGLRenderingContext;
    private shaderProgram: WebGLProgram;

    private lastMoveTime: number;
    private get msBetweenMoves() { return 2000; }
    private isThinking = false;
    private isGameOver = false;

    constructor(private $log: ng.ILogService, private $rootScope: ng.IRootScopeService, private assetService: AssetService, private stockfishService: StockfishService, private chessJsService: ChessJsService) {
    }

    public initialize(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.initPieces();
        this.initLights();

        // wait 200 ms and then start the first move
        this.lastMoveTime = Date.now() - this.msBetweenMoves + 200;

        // sync this board with the 2D board
        this.chessJsService.chess.history({ verbose: true }).forEach(move => {
            this.movePiece(move);
        });
    }

    private executeNextMove() {
        this.isThinking = true;
        this.stockfishService
            .executeNextMove(this.chessJsService.chess)
            .then(move => this.movePiece(move))
            .then(() => {
                if (this.chessJsService.chess.in_checkmate() || this.chessJsService.chess.in_draw() || this.chessJsService.chess.in_stalemate()) {
                    this.isGameOver = true;
                    this.$log.info('Game over!');
                }
            });
    }

    private movePiece(move: chessjs.Move) {
        const pieceToMove = this.pieces.filter(p => p.squareString === move.from)[0];
        this.pieces.filter(p => p.squareString == move.to).forEach(p => p.capture());

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
        this.lastMoveTime = Date.now();
        this.isThinking = false;
    }

    private initPieces() {

        const lightWood = this.assetService.textures['lightWood'];
        const darkWood = this.assetService.textures['darkWood'];

        // black
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter, index) => {
            this.pieces.push(new Pieces.Pawn(this.gl, this.shaderProgram, this.assetService.objs['pawnDark'], darkWood, Pieces.PieceTeam.Black, letter + '7', 'z' + (index + 1)));
        });


        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.assetService.objs['rook'], darkWood, Pieces.PieceTeam.Black, 'a8', 'y1'));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.assetService.objs['rook'], darkWood, Pieces.PieceTeam.Black, 'h8', 'y8'));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.assetService.objs['knight'], darkWood, Pieces.PieceTeam.Black, 'b8', 'y2'));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.assetService.objs['knight'], darkWood, Pieces.PieceTeam.Black, 'g8', 'y7'));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.assetService.objs['bishop'], darkWood, Pieces.PieceTeam.Black, 'c8', 'y3'));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.assetService.objs['bishop'], darkWood, Pieces.PieceTeam.Black, 'f8', 'y6'));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, this.assetService.objs['queen'], darkWood, Pieces.PieceTeam.Black, 'd8', 'y4'));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, this.assetService.objs['king'], darkWood, Pieces.PieceTeam.Black, 'e8', 'y5'));

        // white
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter, index) => {
            this.pieces.push(new Pieces.Pawn(this.gl, this.shaderProgram, this.assetService.objs['pawnLight'], lightWood, Pieces.PieceTeam.White, letter + '2', 'i' + (8 - index)));
        });

        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.assetService.objs['rook'], lightWood, Pieces.PieceTeam.White, 'a1', 'j1'));
        this.pieces.push(new Pieces.Rook(this.gl, this.shaderProgram, this.assetService.objs['rook'], lightWood, Pieces.PieceTeam.White, 'h1', 'j8'));

        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.assetService.objs['knight'], lightWood, Pieces.PieceTeam.White, 'b1', 'j2'));
        this.pieces.push(new Pieces.Knight(this.gl, this.shaderProgram, this.assetService.objs['knight'], lightWood, Pieces.PieceTeam.White, 'g1', 'j7'));

        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.assetService.objs['bishop'], lightWood, Pieces.PieceTeam.White, 'c1', 'j3'));
        this.pieces.push(new Pieces.Bishop(this.gl, this.shaderProgram, this.assetService.objs['bishop'], lightWood, Pieces.PieceTeam.White, 'f1', 'j6'));

        this.pieces.push(new Pieces.Queen(this.gl, this.shaderProgram, this.assetService.objs['queen'], lightWood, Pieces.PieceTeam.White, 'd1', 'j4'));

        this.pieces.push(new Pieces.King(this.gl, this.shaderProgram, this.assetService.objs['king'], lightWood, Pieces.PieceTeam.White, 'e1', 'j5'));

        // these dark pieces should be rotated 180 degrees
        this.pieces.filter(p => p.pieceTeam === Pieces.PieceTeam.Black && (p.type === Pieces.PieceType.Knight || p.type === Pieces.PieceType.Bishop)).forEach(p => {
            p.initialModelViewMatrix = Matrix.RotationY(Utility.degreesToRadians(180)).ensure4x4();
        });

        // these pieces should be randomly rotated to make the textures look less repetative
        this.pieces.filter(p => p.type === Pieces.PieceType.Pawn || p.type === Pieces.PieceType.Rook || p.type === Pieces.PieceType.Queen).forEach(p => {
            p.initialModelViewMatrix = Matrix.RotationY(Utility.degreesToRadians((Math.floor(Math.random() * 360)))).ensure4x4();
        });

        // squares
        for (let number = 8; number > 0; number--) {
            ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach((letter, letterIndex) => {
                const textureImage = (number + letterIndex) % 2 === 0 ? lightWood : darkWood;
                const square = new Square(this.gl, this.shaderProgram, this.assetService.objs['squareDark'], textureImage, letter + number);

                // randomly rotate to avoid repetition
                const rotationAmount = Math.floor(Math.random() * 4) * 90;
                square.initialModelViewMatrix = Matrix.RotationY(Utility.degreesToRadians(rotationAmount)).ensure4x4();

                // randomly flip as well
                if (Math.random() > .5) {
                    square.initialModelViewMatrix = Matrix.RotationX(Utility.degreesToRadians(180)).ensure4x4().multiply(square.initialModelViewMatrix);
                }

                this.squares.push(square);
            });
        }

        // border
        this.border = new Border(this.gl, this.shaderProgram, this.assetService.objs['boardBorder'], darkWood);
    }

    private initLights() {
        let light1 = new Light($V([-1, 1, 1]), $V([.7, .7, .7]), $V([1, 1, 1]), $V([.2, .2, .2]));
        let light2 = new Light($V([15, 15, -30]), $V([0, 0, .2]), $V([.1, .1, .7]), $V([0, 0, .1]));
        let light3 = new Light($V([-15, 15, -30]), $V([.2, 0, 0]), $V([.3, .1, .1]), $V([.1, 0, 0]));
        let light4 = new Light($V([0, 15, 30]), $V([0, .2, 0]), $V([.1, .5, 1.]), $V([0, .1, 0]));

        this.lights.push(light1, light2, light3, light4);
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

        if (!this.isGameOver && !this.isThinking && Date.now() - this.lastMoveTime > this.msBetweenMoves) {
            this.executeNextMove();
        }

        this.getAllObjects().forEach(p => {
            p.draw(projection, modelView, this.lights);
        });
    }

    private getAllObjects(): Renderable[] {
        return (<Renderable[]>this.pieces).concat(this.squares).concat([this.border]);
    }
}