import baseHistoricalChart from './base-historical-chart-factory';

export default class historicalTimeLineChart extends baseHistoricalChart {
  constructor(highchartService, $http, title, yAxisLabel, resourceUrl) {
    super(highchartService, $http);
    this.resourceUrl = resourceUrl;
    this.title = title;
    this.yAxisLabel = yAxisLabel;
  }

  getConfig() {
    this.config = this._chartService.getTimeLineConfig(this.title, this.yAxisLabel);
    this.config.series = this.series;
  }
}
