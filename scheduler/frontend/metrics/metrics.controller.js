export default class MetricsController {
  constructor(highchartService, jobService) {
    this._jobService = jobService;
    this.jobsByProduct = highchartService.getCategoryConfig({
      title: 'Jobs Completed By Product',
      xAxisLabel: 'Product',
      yAxisLabel: 'Job Count'});
    this.jobsByType = undefined;
    this.getChartData();
  }

  //applyDates(chartConfig) {
  //  chartConfig.series.data = chartConfig.dataCallBack();
  //}

  getChartData() {
    this.jobsByProduct.series = [{
      data: this._jobService.getJobsCompletedByProduct(this.jobsByProduct.startDate, this.jobsByProduct.endDate)
    }];
  }
}
