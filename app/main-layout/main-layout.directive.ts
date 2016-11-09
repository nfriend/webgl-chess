import { MainLayoutController } from './main-layout.controller';

export class MainLayoutDirective {
    public static injectionName = 'mainLayout';
    public template = require('./main-layout.html');
    public controller = MainLayoutController;
    public bindToController = true;
    public controllerAs = 'vm';
    public scope = {};
}