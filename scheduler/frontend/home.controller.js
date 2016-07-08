import addJobTemplate from './jobs/add-job-modal.template.html';
import AddJobModalController from './jobs/add-job-modal.controller';
import angular from 'angular';

export default class HomeController {
  /* @ngInject */
  constructor(jobService, $mdDialog, user, $state) {
    // initialize services
    this.jobs = [];
    jobService.getList().then(jobs => this.jobs = jobs);

    this._jobService = jobService;
    this._$mdDialog = $mdDialog;
    this._state = $state;

    this.loading = true;
    this.user = user;
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

  getJobProgress(job) {
    return this._jobService.getProgress(job);
  }

  getTotalJobTime(job) {
    return this._jobService.getTotalJobTime(job);
  }

  getJobTimeRemaining(job) {
    return this._jobService.getJobTimeRemaining(job);
  }

  editJob(job) {
    this._state.go('root.editJob', {jobId:job.id});
  }

  isRework(job) {
    if (job.rework) {
      return 'True';
    }
    return 'False';
  }
}
