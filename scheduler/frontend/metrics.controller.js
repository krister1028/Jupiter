export default class MetricsController {
  constructor(metricsService, highchartService) {
    metricsService.get().then(metrics => this.metrics = metrics);
    this.jobsByProductChart = highchartService.getJobsCompletedByProductChart();
  }
}
