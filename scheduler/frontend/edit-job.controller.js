export default class EditJobController {
  /* @ngInject */
  constructor($stateParams, jobService) {
    this._jobService = jobService;
    this.loading = jobService.loading.then(() => {
      this.job = jobService.jobs.filter(j => j.id = $stateParams.jobId)[0];
      this.tasks = jobService.getJobTasks(this.job);
    });
  }
}
