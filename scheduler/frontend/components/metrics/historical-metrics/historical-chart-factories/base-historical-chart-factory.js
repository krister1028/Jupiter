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
    return this.getResourceData(startDate, endDate);
  }

  getResourceData(startDate, endDate) {
    return this._$http.get(this.resourceUrl, {params: {start_date: startDate, end_date: endDate}})
      .then(response => {
        this.transformResponse(response);
        this.config.xAxis.min = startDate.getTime();
        this.config.xAxis.max = endDate.getTime();
      });
  }

  transformResponse(response) {
    this.refreshSeries(response.data);
  }

  refreshSeries(series) {
    this.series.length = 0;
    this.series.push(...series);
  }
}
