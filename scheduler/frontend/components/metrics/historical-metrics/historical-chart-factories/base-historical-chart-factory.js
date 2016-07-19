export default class historicalChartFactory {
  constructor(highChartService, $http) {
    this._chartService = highChartService;
    this._$http = $http;
    this._chartType = null; // to be overwritten
  }

  getChart() {
    throw new ReferenceError('Method Not Implemented');
  }

  getSeries() {
    throw new ReferenceError('Method Not Implemented');
  }
}
