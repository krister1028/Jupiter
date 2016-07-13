import angular from 'angular';
import loginModalTemplate from './login-modal.template.html';
import LoginModalController from './login-modal.controller';

export default class LoginController {
  /* @ngInject */
  constructor($mdDialog) {
    this._$mdDialog = $mdDialog;
  }

  showLogin(ev) {
    this._$mdDialog.show({
      template: loginModalTemplate,
      controller: LoginModalController,
      controllerAs: 'vm',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }

  cancel() {
    this._$mdDialog.cancel();
  }
}
