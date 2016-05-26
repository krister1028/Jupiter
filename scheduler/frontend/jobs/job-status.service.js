export default class jobStatusService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this.jobStatuses = [];
    this._resourceUrl = '/api/job-statuses/';
    this.get();
  }

  get() {
    return this._$http.get(this._resourceUrl).then(response => this.jobStatuses.push(...response.data));
  }
}
