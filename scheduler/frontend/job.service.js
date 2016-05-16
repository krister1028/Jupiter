import baseResourceClass from './base-resource-class';

export default class jobService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $state, productService, taskService) {
    super($http, $q, $state);
    this._resourceUrl = '/api/jobs/';
    this._productService = productService;
    this._taskService = taskService;
    this.taskCompleteStatus = 3;
    this.taskIncompleteStatus = 1;
  }

  getProgress(job) {
    let totalTime = 0;
    let remainingTime = 0;

    job.job_tasks.forEach(t => {
      totalTime += t.completion_time;
      if (t.status === this._productService.taskCompleteCode) {
        remainingTime += t.completion_time;
      }
    });
    return remainingTime / totalTime;
  }

  markTaskComplete(userId, task, job) {
    task.status = this.taskCompleteStatus;
    task.completed_by = userId;
    this.patch(job.id, {job_tasks: job.job_tasks});
  }

  markTaskIncomplete(task, job) {
    task.status = this.taskIncompleteStatus;
    task.completed_by = null;
    this.patch(job.id, {job_tasks: job.job_tasks});
  }

  setJobDescription(newDescription, jobId) {
    const job = this.itemList.filter(j => j.id === jobId)[0];
    const oldDescription = job.description;
    job.description = newDescription;
    return this.patch(jobId, {description: newDescription}).then(null, () => job.description = oldDescription);
  }
}
