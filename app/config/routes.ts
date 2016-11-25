const routeConfig = ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

    $stateProvider.state({
        name: 'webglchess',
        abstract: true,
        template: '<ui-view></ui-view>'
    });

    $stateProvider.state({
        name: 'webglchess.threedimensional',
        url: '/3d?showMetrics&moveHistory&stockfishLog&msBetweenTurns',
        template: '<main-layout board-to-show="3d"></main-layout>'
    });

    $stateProvider.state({
        name: 'webglchess.twodimensional',
        url: '/2d',
        template: '<main-layout board-to-show="2d"></main-layout>'
    });

    $urlRouterProvider.otherwise('/3d');
}

export { routeConfig };