export default class jobService {
  /* @ngInject */
  constructor($http, productService, taskService, $q) {
    this._$http = $http;
    this._getJobUrl = '/api/jobs/';
    this.jobs = [];
    this.loading = this.get();
    this._productService = productService;
    this._taskService = taskService;
  }

  get() {
    return this._$http.get(this._getJobUrl).then(response => this.jobs.push(...response.data));
  }

  post(data) {
    return this._$http.post(this._getJobUrl, data).then(response => this.jobs.push(response.data));
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
}
