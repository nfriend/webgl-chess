const routeConfig = ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

    $stateProvider.state({
        name: 'webgl-chess',
        abstract: true
    });

    $stateProvider.state({
        name: 'required.home',
        url: '/',
        template: '<main-layout></main-layout>'
    });

    $urlRouterProvider.otherwise('/');
}

export { routeConfig };