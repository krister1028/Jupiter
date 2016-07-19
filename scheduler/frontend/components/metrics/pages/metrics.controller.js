import HistoricalDateChart from '../historical-metrics/historical-chart-factories/base-historical-date-chart';

export default class MetricsController {
  constructor(highChartService, $http) {
    this.charts = [
      new HistoricalDateChart(highChartService, $http, 'Backlog Minutes By Expertise Level', 'Minutes')
    ];
  }
}
