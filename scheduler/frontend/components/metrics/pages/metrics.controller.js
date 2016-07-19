import HistoricalTimeLineChart from '../historical-metrics/historical-chart-factories/historical-time-line-chart';
import HistoricalAggregateChart from '../historical-metrics/historical-chart-factories/historical-aggregate-chart';

export default class MetricsController {
  constructor(highChartService, $http) {
    this.charts = [
      new HistoricalTimeLineChart(highChartService, $http, 'Backlog Minutes By Expertise Level', 'Minutes', '/backlog-hours'),
      new HistoricalAggregateChart(highChartService, $http, 'Task Completion Minutes By Technician', 'Minutes', 'Technician Name', '/task-completion-by-tech')
    ];
  }
}
