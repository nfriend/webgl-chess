import { AssetService } from './obj-service/obj.service';
import { WebGLManagerService } from './webgl-manager.service';
import { ChessJsService } from '../chessjs/chessjs.service';

interface GameStatus {
    draw: boolean;
    stalemate: boolean;
    checkmate: boolean;
    check: boolean;
    insufficientMaterial: boolean;
    threefoldRepetition: boolean;
    gameOver: boolean;
}

export class ThreeDimensionalBoardController {
    public static injectionName = 'WebGLChess.ThreeDimensionalBoardService';
    public static $inject = ['$log', '$scope', '$timeout', '$stateParams', AssetService.injectionName, WebGLManagerService.injectionName, ChessJsService.injectionName];

    private chess: chessjs.Chess;

    constructor(private $log: ng.ILogService, private $scope: ng.IScope, private $timeout: ng.ITimeoutService, private $stateParams: ng.ui.IStateParamsService, private assetServie: AssetService, private webGLManagerService: WebGLManagerService, private chessJsService: ChessJsService) {
        this.chess = this.chessJsService.chess;

        this.$scope.$watch(() => {
            const gameStatus: GameStatus = {
                draw: this.chess.in_draw(),
                stalemate: this.chess.in_stalemate(),
                checkmate: this.chess.in_checkmate(),
                check: this.chess.in_check(),
                insufficientMaterial: this.chess.insufficient_material(),
                threefoldRepetition: this.chess.in_threefold_repetition(),
                gameOver: this.chess.game_over()
            };
            return gameStatus;
        }, (newVal, oldVal) => {
            this.messageVisible = Object.keys(newVal).some(key => newVal[key]);
            if (this.messageVisible) {
                this.messageText = this.getStatusMessage(newVal);
            }
        }, true);
    }

    loadingValue;
    loadingText = '';
    loadingVisible = true;
    messageText = '';
    messageVisible = false;
    showMetrics = false;

    $onInit = () => {
        this.showMetrics = this.$stateParams['showMetrics'] === 'true';

        this.assetServie.downloadAllAssets().then(() => {
            this.webGLManagerService.initialize();
        }, null, state => {
            this.loadingValue = Math.floor((state.current / state.total) * 100);
            if (this.loadingValue === 100) {
                this.loadingText = 'done!'
                this.$timeout(1000).then(() => {
                    this.loadingVisible = false;
                });
            } else {
                this.loadingText = state.loadingText;
            }
        });
    }

    getStatusMessage = (gameStatus: GameStatus): string => {
        if (gameStatus.draw) {
            return 'Draw! Game over.';
        } else if (gameStatus.stalemate) {
            return 'Stalemate! Game over.';
        } else if (gameStatus.checkmate) {
            return 'Checkmate! Game over.';
        } else if (gameStatus.threefoldRepetition) {
            return 'Threefold Repetition! Game over.';
        } else if (gameStatus.insufficientMaterial) {
            return 'Insufficient material! Game over.';
        } else if (gameStatus.check) {
            return 'Check!';
        } else if (gameStatus.gameOver) {
            return 'Game over!';
        } else {
            return '';
        }
    }
}