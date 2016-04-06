export default class HomeController {
  constructor(userService) {
    this.user = userService.user;
    this.loading = true;
    userService.loading.then(() => this.loading = false);
  }
}
