export default class LoginModalController {
  /* @ngInject */
  constructor($mdDialog, userService, $state) {
    this._$mdDialog = $mdDialog;
    this._$state = $state;
    this._userService = userService;
    this.username = null;
    this.password = null;
  }

  cancel() {
    this._$mdDialog.cancel();
  }

  doLogin() {
    this._$mdDialog.cancel();
    this._userService.loginUser(this.username, this.password).then(
      () => this._$state.go('root.home'), this._$state.go('root.login')
    );
  }
}
