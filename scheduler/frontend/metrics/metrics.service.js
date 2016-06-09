export default class metricsService {
  constructor($http) {
    this._backLogUrl = '/backlog-hours/';
    this._$http = $http;
  }

  getBacklog() {
    return this._$http.get(this._backLogUrl).then(response => response.data);
  }
}
