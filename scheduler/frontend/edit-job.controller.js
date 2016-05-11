export default class EditJobController {
  /* @ngInject */
  constructor($stateParams, jobService, taskService) {
    this._jobService = jobService;
    this._taskService = taskService;
    jobService.loading.then(() => {
      this.job = jobService.jobs.filter(j => j.id === $stateParams.jobId)[0];
    });
  }
}
