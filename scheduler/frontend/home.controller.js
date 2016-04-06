export default class HomeController {
  constructor(userService, $state) {
    userService.login().then(
      user => this.user = user,
      () => $state.go('loggedOut')
    );
  }
}
