export default class HomeController {
  /* @ngInject */
  constructor(userService) {
    this.user = userService.user;
    this.loading = true;
    userService.loading.then(() => this.loading = false);
  }
}
