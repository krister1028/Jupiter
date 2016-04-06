export default class LoginModalController {
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
    this._userService.user.password = this.password;
    this._userService.user.username = this.username;
    this._userService.getUser().then(() => this._$state.go('home'));
  }
}
