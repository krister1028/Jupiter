export default class MetricsController {
  constructor(highchartService) {
    this.jobsByProduct = highchartService.getJobsCompletedByProductChart();
    this.jobByType = highchartService.getJobsCompletedByTypeChart();
  }
}
