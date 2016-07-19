import HistoricalTimeLineChart from '../historical-metrics/historical-chart-factories/historical-time-line-chart';

export default class MetricsController {
  constructor(highChartService, $http) {
    this.charts = [
      new HistoricalTimeLineChart(highChartService, $http, 'Backlog Minutes By Expertise Level', 'Minutes', '/backlog-hours')
    ];
  }
}
