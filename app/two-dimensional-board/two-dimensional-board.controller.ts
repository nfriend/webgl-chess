import { StockfishService } from '../stockfish/stockfish.service';
import { ChessJsService } from '../chessjs/chessjs.service';

interface Square {
    letter: string;
    square: string;
}

export class TwoDimensionalBoardController {
    public static injectionName = 'WebGLChess.TwoDimensionalBoardService';
    public static $inject = ['$log', '$mdToast', StockfishService.injectionName, ChessJsService.injectionName];

    private chess: chessjs.Chess;

    constructor(private $log: ng.ILogService, private $mdToast: ng.material.IToastService, private stockfishService: StockfishService, chessJsService: ChessJsService) {
        this.chess = chessJsService.chess;
        this.updateBoard();
    }

    board: Square[][];
    input = '';

    to: string;
    from: string;
    selected: string;

    inputKeydown = (ev: JQueryKeyEventObject) => {
        if (ev.which === 13) {
            this.chess.move({
                from: this.input.substr(0, 2),
                to: this.input.substr(2, 2)
            });
            this.input = '';
            this.updateBoard();
            this.stockfishService.executeNextMove(this.chess).then(() => {
                this.updateBoard();
            });
        }
    }

    squareClicked = (square: string) => {
        if (!this.from) {
            this.from = square;
            this.selected = this.from;
        } else {
            this.to = square;
            let result = this.chess.move({
                from: this.from,
                to: this.to
            });
            if (result) {
                this.updateBoard();
                this.stockfishService.executeNextMove(this.chess).then(() => {
                    this.updateBoard();
                });
            }
            this.from = this.to = this.selected = null;
        }
    }

    private fontMap = {
        dark: {
            w: {
                r: 'R',
                n: 'H',
                b: 'B',
                q: 'Q',
                k: 'K',
                p: 'P'
            },
            b: {
                r: 'T',
                n: 'J',
                b: 'N',
                q: 'W',
                k: 'L',
                p: 'O',
            }
        },
        light: {
            w: {
                r: 'r',
                n: 'h',
                b: 'b',
                q: 'q',
                k: 'k',
                p: 'p'
            },
            b: {
                r: 't',
                n: 'j',
                b: 'n',
                q: 'w',
                k: 'l',
                p: 'o'
            }
        }
    };

    private letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    private numbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

    private updateBoard() {
        let board: Square[][] = [];

        this.numbers.forEach(number => {
            const row: Square[] = [];
            this.letters.forEach(letter => {
                let squareString = letter + number;
                let square = this.chess.get(squareString);
                let squareColor = this.chess.square_color(squareString);
                if (square) {
                    // this is an occupied square
                    row.push({
                        letter: this.fontMap[squareColor][square.color][square.type],
                        square: squareString
                    });
                } else {
                    // this square is empty
                    row.push({
                        letter: squareColor === 'light' ? ' ' : '+',
                        square: squareString
                    });
                }
            });

            board.push(row);
        });

        this.board = board;

        let message;
        if (this.chess.in_check()) {
            message = 'Check!';
        }
        if (this.chess.in_threefold_repetition()) {
            message = 'Threefold Repetition!';
        }
        if (this.chess.in_checkmate()) {
            message = 'Checkmate!';
        }
        if (this.chess.in_draw()) {
            message = 'Draw!';
        }
        if (this.chess.in_stalemate()) {
            message = 'Stalemate!';
        }

        if (message) {
            this.$mdToast.show(
                this.$mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(10000)
            );
        }

        this.$mdToast
    }

}