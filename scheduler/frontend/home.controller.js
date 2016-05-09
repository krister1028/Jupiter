export default class HomeController {
  /* @ngInject */
  constructor(userService, productService, jobService) {
    this.user = userService.user;
    this.products = productService.products;
    this.jobs = jobService.jobs;

    this.loading = true;
    userService.loading.then(() => this.loading = false);
  }
}
