export default class MetricsController {
  constructor(highchartService) {
    this.jobsByProduct = highchartService.getJobsCompletedByProductChart();
    highchartService.getJobsCompletedByTypeChart().then(config => {
      this.jobsByType = config;
    });
  }
}
