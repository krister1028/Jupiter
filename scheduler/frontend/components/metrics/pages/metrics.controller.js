import HistoricalDateChart from '../historical-metrics/historical-chart-factories/historical-date-chart';

export default class MetricsController {
  constructor(highChartService, $http) {
    this.charts = [
      new HistoricalDateChart(highChartService, $http, 'Backlog Minutes By Expertise Level', 'Minutes', '/backlog-hours')
    ];
  }
}
