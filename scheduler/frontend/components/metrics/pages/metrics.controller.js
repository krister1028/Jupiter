import HistoricalTimeLineChart from '../historical-metrics/historical-chart-factories/historical-time-line-chart';
import HistoricalAggregateChart from '../historical-metrics/historical-chart-factories/historical-aggregate-chart';
import HistoricalCategoryChart from '../historical-metrics/historical-chart-factories/historical-category-chart';

export default class MetricsController {
  constructor(highChartService, $http) {
    this.charts = [
      new HistoricalTimeLineChart(highChartService, $http, 'Backlog Minutes By Expertise Level', 'Minutes', '/backlog-hours'),
      new HistoricalAggregateChart(highChartService, $http, 'Task Completion Minutes By Technician', 'Expertise Level', 'Minutes', '/task-completion-by-tech'),
      new HistoricalCategoryChart(highChartService, $http, 'Jobs Completed By Product', 'Product Description', 'Job Count', '/jobs-completed-by-product'),
      new HistoricalCategoryChart(highChartService, $http, 'Jobs Completed By Type', 'Type Description', 'Job Count', '/jobs-completed-by-type'),
      new HistoricalCategoryChart(highChartService, $http, 'Job Cycle Time', 'Job Description', 'Cycle Time', '/job-cycle-time')
    ];
  }
}
