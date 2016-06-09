export default class MetricsController {
  constructor(highchartService, jobService, productService, jobStatusService, jobTypeService, metricsService) {
    this._jobService = jobService;
    this._jobStatusService = jobStatusService;
    this._highchartService = highchartService;
    this._metricService = metricsService;

    this.jobsByProduct = highchartService.getColumnConfig({
      categories: productService.getDescriptionList(),
      title: 'Jobs By Product',
      xAxisLabel: 'Product',
      yAxisLabel: 'Job Count'});
    this.jobsByType = highchartService.getColumnConfig({
      categories: jobTypeService.getDescriptionList(),
      title: 'Jobs By Type',
      xAxisLabel: 'Type',
      yAxisLabel: 'Job Count'});
    this.taskBacklog = highchartService.getTimeLineConfig({
      title: 'Task By Expertise Backlog',
      yAxisLabel: 'Backlog (minutes)'});
  }

  getJobsByProductData() {
    this._jobService.getJobsCreatedByDateRange(this.jobsByProduct.startDate, this.jobsByProduct.endDate).then(jobs => {
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
    this._jobService.getJobsCreatedByDateRange(this.jobsByType.startDate, this.jobsByType.endDate).then(jobs => {
      this.jobsByType.series = this._highchartService.getCategoryCount(
        jobs,
        this.jobsByType.xAxis.categories,
        this._jobStatusService.getDescriptionList(),
        'jobType.description',
        'jobStatus.description'
      );
    });
  }

  getTaskBackLogData() {
    this._metricService.getBacklog().then(backlog => {
      this.taskBacklog.series = this._highchartService.getDataForTimeLine(backlog, ['High', 'Medium', 'Low', 'CP']);
    });
  }
}
