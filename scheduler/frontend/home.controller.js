import addJobTemplate from './add-job-modal.template.html';
import AddJobModalController from './add-job-modal.controller';
import angular from 'angular';

export default class HomeController {
  /* @ngInject */
  constructor(userService, productService, jobService, $mdDialog) {
    this.user = userService.user;
    this.products = productService.products;
    this.jobs = jobService.jobs;
    this.jobService = jobService;
    this._$mdDialog = $mdDialog;

    this.loading = true;
    userService.loading.then(() => this.loading = false);
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
}
