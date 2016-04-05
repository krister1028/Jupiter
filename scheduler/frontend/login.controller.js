import angular from 'angular';
import loginModalTemplate from './login-modal.template.html';

export default class LoginController {
  constructor($mdDialog) {
    this._$mdDialog = $mdDialog;
  }

  showLogin(ev) {
    this._$mdDialog.show({
      // controller: this,
      template: loginModalTemplate,
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }

  cancel() {
    this._$mdDialog.hide();
  }
}
