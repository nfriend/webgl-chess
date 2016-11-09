const routeConfig = ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

    $stateProvider.state({
        name: 'webglchess',
        abstract: true,
        template: '<ui-view></ui-view>'
    });

    $stateProvider.state({
        name: 'webglchess.home',
        url: '/',
        template: '<main-layout></main-layout>'
    });

    $urlRouterProvider.otherwise('/');
}

export { routeConfig };