export default class MetricsController {
  constructor(highchartService, jobService, productService, jobStatusService) {
    this._jobService = jobService;
    this._jobStatusService = jobStatusService;
    this._highchartService = highchartService;

    this.jobsByProduct = highchartService.getColumnConfig({
      categories: productService.getDescriptionList(),
      title: 'Jobs By Product',
      xAxisLabel: 'Product',
      yAxisLabel: 'Job Count'});
    this.jobsByType = highchartService.getColumnConfig({
      title: 'Jobs By Type',
      xAxisLabel: 'Type',
      yAxisLabel: 'Job Count'});
  }

  getJobsByProductData() {
    this._jobService.getJobsCompletedByDateRange(this.jobsByProduct.startDate, this.jobsByProduct.endDate).then(jobs => {
      this.jobsByProduct.series = this._highchartService.getCategoryCount(
        jobs,
        this.jobsByProduct.xAxis.categories,
        this._jobStatusService.getDescriptionList(),
        'productItem.description',
        'jobStatus.description'
      );
    });
  }

  getJobsByTypeData() {
    this._jobService.getJobsCompletedByType(this.jobsByType.startDate, this.jobsByType.endDate).then(jobsByType => {
      const data = [];
      Object.keys(jobsByType).forEach(p => data.push([p, jobsByType[p]]));
      this.jobsByType.series[0].data = data;
    });
  }
}
