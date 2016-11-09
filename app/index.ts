require('script!../node_modules/jquery/dist/jquery.js');
require('script!../node_modules/angular/angular.js');
require('script!../node_modules/angular-aria/angular-aria.js');
require('script!../node_modules/angular-animate/angular-animate.js');
require('script!../node_modules/angular-material/angular-material.js');
require('script!../node_modules/angular-ui-router/release/angular-ui-router.js');

/* yeoman:importBlock */
import { routeConfig } from './config/routes';

import { MainLayoutDirective } from './main-layout/main-layout.directive';
import { MainLayoutController } from './main-layout/main-layout.controller';
import { MainLayoutService } from './main-layout/main-layout.service';
/* /yeoman:importBlock */

angular
    .module('required',
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
    /* /yeoman:registrationBlock */

    .config(['$stateProvider', '$urlRouterProvider', routeConfig]);