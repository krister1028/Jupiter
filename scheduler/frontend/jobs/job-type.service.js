export default class jobTypeService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this.jobTypes = [];
    this._resourceUrl = '/api/job-types/';
    this.get();
  }

  get() {
    return this._$http.get(this._resourceUrl).then(response => this.jobTypes.push(...response.data));
  }
}
