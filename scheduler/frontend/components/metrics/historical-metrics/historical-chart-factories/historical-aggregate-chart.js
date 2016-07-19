import baseHistoricalChart from './base-historical-chart-factory';

export default class historicalTimeLineChart extends baseHistoricalChart {
  constructor(highchartService, $http, title, xAxisLabel, yAxisLabel, resourceUrl) {
    super(highchartService, $http);
    this.resourceUrl = resourceUrl;
    this.title = title;
    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
  }

  getConfig() {
    this.config = this._chartService.getHistoricalAggregateConfig(this.title, this.xAxisLabel, this.yAxisLabel);
    this.config.series = this.series;
  }
}
