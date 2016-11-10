import { StockfishService } from './stockfish.service';
import { ChessJsService } from '../chessjs/chessjs.service';

interface Square {
    letter: string;
    square: string;
}

export class StockfishController {
    public static injectionName = 'WebGLChess.StockfishService';
    public static $inject = ['$log', StockfishService.injectionName, ChessJsService.injectionName];

    private chess: chessjs.Chess;

    constructor(private $log: ng.ILogService, private stockfishService: StockfishService, chessJsService: ChessJsService) {
        this.chess = chessJsService.chess;
        this.updateBoard();
    }

    board: Square[][];
    input = '';

    to: string;
    from: string;

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
        console.log(square);
    }

    private updateBoard() {
        let board: Square[][] = [];

        let fontMap = {
            b: {
                r: 'T',
                R: 'R',
                n: 'J',
                N: 'H',
                b: 'N',
                B: 'B',
                q: 'W',
                Q: 'Q',
                k: 'L',
                K: 'K',
                p: 'O',
                P: 'P',
                '.': '+'
            },
            w: {
                r: 't',
                R: 'r',
                n: 'j',
                N: 'h',
                b: 'n',
                B: 'b',
                q: 'w',
                Q: 'q',
                k: 'l',
                K: 'k',
                p: 'o',
                P: 'p',
                '.': ' '
            }
        };

        let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        let numbers = ['8', '7', '6', '5', '4', '3', '2', '1'];

        numbers.forEach(number => {
            const row: Square[] = [];
            letters.forEach(letter => {
                let squareString = letter + number;
                let square = this.chess.get(squareString);
                if (square) {
                    // this is an occupied square
                    row.push({
                        letter: fontMap[square.color][square.type],
                        square: squareString
                    });
                } else {
                    // this square is empty
                    row.push({
                        letter: this.chess.square_color(squareString) === 'light' ? ' ' : '+',
                        square: squareString
                    });
                }
            });

            board.push(row);
        });

        console.log(board);

        this.board = board;

    }
}