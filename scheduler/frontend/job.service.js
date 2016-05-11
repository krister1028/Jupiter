export default class jobService {
  /* @ngInject */
  constructor($http, productService) {
    this._$http = $http;
    this._getJobUrl = '/api/jobs/';
    this.jobs = [];
    this.loading = this.get();
    this._taskCompleteCode = 3;
    this._productService = productService;
  }

  get() {
    return this._$http.get(this._getJobUrl).then(response => {
      const jobs = [...response.data];
      return this._productService.loading.then(
        () => {
          jobs.forEach(j => j.tasks = this._getJobTasks(j));
          this.jobs.push(...jobs);
        }
      );
    });
  }

  _getJobTasks(job) {
    return this._productService.products.filter(p => p.id = job.product_id)[0].tasks;
  }

  post(data) {
    return this._$http.post(this._getJobUrl, data).then(response => this.jobs.push(response.data));
  }

  getProgress(job) {
    let totalTime = 0;
    let remainingTime = 0;

    job.tasks.forEach(t => {
      totalTime += t.completion_time;
      if (t.status === this._taskCompleteCode) {
        remainingTime += t.completion_time;
      }
    });
    return remainingTime / totalTime;
  }
}
