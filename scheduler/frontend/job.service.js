export default class jobService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this._getJobUrl = '/api/jobs/';
    this.jobs = [];
    this.loading = this.getJobs();
  }

  getJobs() {
    return this._$http.get(this._getJobUrl).then(response => this.jobs.push(...response.data));
  }
}
