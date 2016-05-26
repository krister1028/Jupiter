export default class metricsService {
  constructor($http, highchartService) {
    this._resourceUrl = '/api/daily-metrics/';
    this._$http = $http;
  }

  get() {
    return this._$http.get(this._resourceUrl).then(response => response.data);
  }
}
