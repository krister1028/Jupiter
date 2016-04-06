export default class LoginModalController {
  constructor($mdDialog, userService) {
    this._$mdDialog = $mdDialog;
    this._userService = userService;
    this.user = {};
  }

  cancel() {
    this._$mdDialog.cancel();
  }

  doLogin() {
    this._userService.login(this.user);
  }
}
