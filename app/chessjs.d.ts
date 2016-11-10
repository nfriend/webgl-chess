declare class Chess extends chessjs.Chess { }

declare namespace chessjs {

    class Chess {
        constructor(fen?: string);

        ascii(): string;
        clear(): void;
        fen(): string;
        game_over(): boolean;
        get(square: string): chessjs.ChessPiece;
        history(options?: { verbose: boolean }): Move[];
        in_check(): boolean;
        in_checkmate(): boolean;
        in_draw(): boolean;
        in_stalemate(): boolean;
        in_threefold_repetition(): boolean;
        header(...headers: string[]);
        insufficient_material(): boolean;
        load(fen: string): boolean;
        load_pgn(pgnMoves: string[], options?: { newline_char?: string, sloppy?: boolean }): boolean;
        move(move: string | { from: string; to: string, promotion?: boolean }, options?: { sloppy: boolean }): Move;
        moves(options?: { square?: string; verbose?: boolean }): string[] | Move[];
        pgn(options?: { max_width?: number; newline_char?: string;  }): string;
        put(piece: ChessPiece, square: string): boolean;
        remove(square: string): ChessPiece;
        reset(): void;
        square_color(square: string): 'light' | 'dark' | null;
        turn(): 'b' | 'w';
        undo(): Move;
        validate_fen(fen: string): { valid: boolean, error_number: number, error: string }; 

        readonly PAWN: string;
        readonly ROOK: string;
        readonly KNIGHT: string;
        readonly BISHOP: string;
        readonly QUEEN: string;
        readonly KING: string;
        readonly BLACK: string;
        readonly WHITE: string;

    }

    interface ChessPiece {
        type: string;
        color: string;
    }

    interface Move {
        color: string;
        from: string;
        to: string;
        flags: string;
        piece: string;
        san?: string;
        captured?: boolean;
        promotion?: boolean;
    }
}
