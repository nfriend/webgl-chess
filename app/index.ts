import * as $ from 'jquery';
import * as angular from 'angular';
import 'angular-aria';
import 'angular-animate';
import 'angular-material';
import 'angular-ui-router';
require('script!../node_modules/chess.js/chess.min.js');

/* yeoman:importBlock */
import { routeConfig } from './config/routes';
import { MainLayoutDirective } from './main-layout/main-layout.directive';
import { MainLayoutController } from './main-layout/main-layout.controller';
import { MainLayoutService } from './main-layout/main-layout.service';
import { StockfishDirective } from './stockfish/stockfish.directive';
import { StockfishController } from './stockfish/stockfish.controller';
import { StockfishService } from './stockfish/stockfish.service';
import { ChessJsService } from './chessjs/chessjs.service';
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
    .directive(StockfishDirective.injectionName, () => new StockfishDirective)
    .controller(StockfishController.injectionName, StockfishController)
    .service(StockfishService.injectionName, StockfishService)
    .service(ChessJsService.injectionName, ChessJsService)
    /* /yeoman:registrationBlock */

    .config(['$stateProvider', '$urlRouterProvider', routeConfig]);