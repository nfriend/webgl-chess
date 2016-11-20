require('script!../node_modules/jquery/dist/jquery.min.js');
import 'angular';
import 'angular-aria';
import 'angular-animate';
import 'angular-material';
import 'angular-ui-router';
import 'hammerjs';
require('script!../node_modules/chess.js/chess.min.js');
require('script!./third-party/sylvester.min.js');
require('script!./third-party/glUtils.min.js');
require('script!./third-party/stats.min.js');

/* yeoman:importBlock */
import { routeConfig } from './config/routes';
import { MainLayoutDirective } from './main-layout/main-layout.directive';
import { MainLayoutController } from './main-layout/main-layout.controller';
import { MainLayoutService } from './main-layout/main-layout.service';
import { StockfishService } from './stockfish/stockfish.service';
import { ChessJsService } from './chessjs/chessjs.service';
import { TwoDimensionalBoardDirective } from './two-dimensional-board/two-dimensional-board.directive';
import { TwoDimensionalBoardController } from './two-dimensional-board/two-dimensional-board.controller';
import { ThreeDimensionalBoardDirective } from './three-dimensional-board/three-dimensional-board.directive';
import { ThreeDimensionalBoardController } from './three-dimensional-board/three-dimensional-board.controller';
import { AssetService } from './three-dimensional-board/obj-service/obj.service';
import { WebGLManagerService } from './three-dimensional-board/webgl-manager.service';
import { ChessBoardService } from './three-dimensional-board/objects/chessboard.service';
import { StatsDirective } from './stats/stats.directive';
import { StatsController } from './stats/stats.controller';
import { StatsService } from './stats/stats.service';
/* /yeoman:importBlock */

angular
    .module('webgl-chess',
    [
        'ngAria',
        'ngAnimate',
        'ngMaterial',
        'ui.router'
    ])

    /* yeoman:registrationBlock */
    .directive(MainLayoutDirective.injectionName, () => new MainLayoutDirective)
    .controller(MainLayoutController.injectionName, MainLayoutController)
    .service(MainLayoutService.injectionName, MainLayoutService)
    .service(StockfishService.injectionName, StockfishService)
    .service(ChessJsService.injectionName, ChessJsService)
    .directive(TwoDimensionalBoardDirective.injectionName, () => new TwoDimensionalBoardDirective)
    .controller(TwoDimensionalBoardController.injectionName, TwoDimensionalBoardController)
    .directive(ThreeDimensionalBoardDirective.injectionName, ['$window', WebGLManagerService.injectionName, ($window: ng.IWindowService, wms: WebGLManagerService) => new ThreeDimensionalBoardDirective($window, wms)])
    .controller(ThreeDimensionalBoardController.injectionName, ThreeDimensionalBoardController)
    .service(AssetService.injectionName, AssetService)
    .service(WebGLManagerService.injectionName, WebGLManagerService)
    .service(ChessBoardService.injectionName, ChessBoardService)
    .directive(StatsDirective.injectionName, [StatsService.injectionName, (ss: StatsService) => new StatsDirective(ss)])
    .controller(StatsController.injectionName, StatsController)
    .service(StatsService.injectionName, StatsService)
    /* /yeoman:registrationBlock */

    .config(['$stateProvider', '$urlRouterProvider', routeConfig])
    .config(['$mdThemingProvider', ($mdThemingProvider: ng.material.IThemingProvider) => {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey')
            .accentPalette('orange');
            //.dark();
    }]);