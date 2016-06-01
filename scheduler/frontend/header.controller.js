export default class HeaderController {
  constructor($state, userService) {
    this._$state = $state;
    this._userService = userService;
    this.getPageTitle();
  }

  logout() {
    this._userService.logOutUser().then(() => {
      this._$state.go('login');
    });
  }

  getPageTitle() {
    return this._$state.current.data.pageTitle;
  }

  isLogin() {
    return this._$state.$current.name === 'login';
  }

}
