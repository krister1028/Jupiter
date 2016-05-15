export default class jobService {
  /* @ngInject */
  constructor($http, productService, taskService) {
    this._$http = $http;
    this._getJobUrl = '/api/jobs/';
    this.jobs = [];
    this.loading = this.get();
    this._productService = productService;
    this._taskService = taskService;
    this.taskCompleteStatus = 3;
    this.taskIncompleteStatus = 1;
  }

  _detailUrl(jobId) {
    return `${this._getJobUrl}${jobId}/`;
  }

  get() {
    return this._$http.get(this._getJobUrl).then(response => this.jobs.push(...response.data));
  }

  post(data) {
    return this._$http.post(this._getJobUrl, data).then(response => this.jobs.push(response.data));
  }

  patch(jobId, data) {
    return this._$http.patch(this._detailUrl(jobId), data);
  }

  put(job) {
    return this._$http.put(this._detailUrl(job.id), job);
  }

  delete(jobId) {
    return this._$http.delete(this._detailUrl(jobId));
  }

  deleteJob(job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
    this.delete(job.id);
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
    const job = this.jobs.filter(j => j.id === jobId)[0];
    const oldDescription = job.description;
    job.description = newDescription;
    return this.patch(jobId, {description: newDescription}).then(null, () => job.description = oldDescription);
  }
}
