export default class EditJobController {
  /* @ngInject */
  constructor($stateParams, jobService, taskService, groupUserService) {
    this._jobService = jobService;
    this._taskService = taskService;
    this.groupUsers = groupUserService.groupUsers;
    jobService.loading.then(() => {
      this.job = jobService.jobs.filter(j => j.id === $stateParams.jobId)[0];
    });
  }

  getTaskStyle(task) {
    if (task.completed_by !== null) {
      return {'text-decoration': 'line-through'};
    }
  }

  markComplete(task) {
    this._taskService.patch()
  }
}
