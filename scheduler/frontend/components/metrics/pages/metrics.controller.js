export default class MetricsController {
  constructor(highChartService) {
    this.charts = [{url: '/abc/', config: {}, type: highChartService.historicalChart}];
    this.defaultHistoryDays = 7;
    this._chartService = highChartService;
    this.endDate = this.getDefaultEndDate();
    this.startDate = this.getDefaultStartDate();
  }

  $onInit() {
    this.fetchConfigs();
  }

  getDefaultEndDate() {
    return new Date();
  }

  getDefaultStartDate() {
    return new Date(new Date().setDate(new Date().getDate() - this.defaultHistoryDays));
  }

  applyDates() {
    this.fetchConfigs();
  }

  fetchConfigs() {
    this.charts.forEach(chart => this._chartService.createResourceChart(chart));
  }
}
