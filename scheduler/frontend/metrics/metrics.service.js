export default class metricsService {
  constructor($http, highchartService, jobService) {
    this._resourceUrl = '/api/daily-metrics/';
    this._$http = $http;
    this._highChartService = highchartService;
    this._jobService = jobService;
  }

  get() {
    return this._$http.get(this._resourceUrl).then(response => response.data);
  }
}
