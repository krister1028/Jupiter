import addJobTemplate from './add-job-modal.template.html';
import AddJobModalController from './add-job-modal.controller';
import angular from 'angular';

export default class HomeController {
  /* @ngInject */
  constructor(userService, productService, jobService, $mdDialog) {
    this.products = [];
    productService.get().then(products => this.products.push(...products));
    this.jobs = [];
    jobService.get().then(jobs => this.jobs = jobs);
    this.jobService = jobService;
    this._$mdDialog = $mdDialog;

    this.showFullNames = true;

    this.loading = true;
    userService.getUser().then(user => {
      this.loading = false;
      this.user = user;
    });
  }

  addJob(ev) {
    this._$mdDialog.show({
      template: addJobTemplate,
      controller: AddJobModalController,
      controllerAs: 'vm',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  }

  getProductText(product) {
    if (this.showFullNames) {
      return product.description;
    }
    return product.code;
  }

  nameAbbreviationToggleText() {
    if (this.showFullNames) {
      return 'Show Product Code';
    }
    return 'Show Product Name';
  }
}
