export default class jobService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this._getJobUrl = '/api/jobs/';
    this.jobs = [];
    this.loading = this.getJobs();
    this._taskCompleteCode = 3;
  }

  getJobs() {
    return this._$http.get(this._getJobUrl).then(response => this.jobs.push(...response.data));
  }

  getProgress(job) {
    let totalTime = 0;
    let remainingTime = 0;

    job.job_tasks.forEach(t => {
      totalTime += t.completion_time;
      if (t.status === this._taskCompleteCode) {
        remainingTime += t.completion_time;
      }
    });
    return remainingTime / totalTime;
  }
}
