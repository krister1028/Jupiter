export default class HomeController {
  /* @ngInject */
  constructor(userService, productService) {
    this.user = userService.user;
    this.products = productService.products;

    this.loading = true;
    userService.loading.then(() => this.loading = false);
  }
}
