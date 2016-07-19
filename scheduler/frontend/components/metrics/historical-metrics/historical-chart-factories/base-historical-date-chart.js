import baseHistoricalChart from './base-historical-chart-factory';

export default class historicalDateChart extends baseHistoricalChart {
  constructor(highchartService, $http, title, xAxisLabel) {
    super(highchartService, $http);
    this.title = title;
    this.xAxisLabel = xAxisLabel;
    this.series = [];
    this.chart = {};
  }
}
