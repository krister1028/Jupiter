import addJobTemplate from './jobs/add-job-modal.template.html';
import AddJobModalController from './jobs/add-job-modal.controller';
import angular from 'angular';

export default class HomeController {
  /* @ngInject */
  constructor(userService, productService, jobService, $mdDialog, taskService) {
    // initialize services
    this.products = [];
    productService.getList().then(products => this.products.push(...products));
    this.jobs = [];
    jobService.getList().then(jobs => this.jobs = jobs);
    this.tasks = [];
    taskService.getList().then(tasks => this.tasks = tasks);

    this.jobService = jobService;
    this._$mdDialog = $mdDialog;

    this.showFullNames = true;
    this.showMetrics = false;

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
