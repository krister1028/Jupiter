export default class historicalChartFactory {
  constructor(highChartService, $http) {
    this._chartService = highChartService;
    this._$http = $http;
    this.series = [];
    this.config = {};
  }

  getConfig() {
    throw new ReferenceError('Method Not Implemented');
  }

  getSeries(startDate, endDate) {
    return this._$http.get(this.resourceUrl, {params: {start_date: startDate, end_date: endDate}}).then(response => {
      this.series.length = 0;
      this.series.push(...response.data);
    });
  }
}
