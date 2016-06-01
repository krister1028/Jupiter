export default class MetricsController {
  constructor(highchartService, jobService) {
    this._jobService = jobService;

    this.jobsByProduct = highchartService.getCategoryConfig({
      title: 'Jobs Completed By Product',
      xAxisLabel: 'Product',
      yAxisLabel: 'Job Count'});
    this.jobsByType = highchartService.getCategoryConfig({
      title: 'Jobs Completed By Type',
      xAxisLabel: 'Type',
      yAxisLabel: 'Job Count'});
    this._allCharts = [this.jobsByProduct, this.jobsByType];
    this.getDefaultDates().then(() => this.getChartData());
  }

  getChartData() {
    this.getJobsByProductData();
    this.getJobsByTypeData();
  }

  getDefaultDates() {
    return this._jobService.getOldestJobDate().then(oldestDate => {
      this._allCharts.forEach(config => {
        config.startDate = oldestDate;
        config.endDate = new Date();
      });
    });
  }

  getJobsByProductData() {
    this._jobService.getJobsCompletedByProduct(this.jobsByProduct.startDate, this.jobsByProduct.endDate).then(jobsByProduct => {
      const data = [];
      Object.keys(jobsByProduct).forEach(p => data.push([p, jobsByProduct[p]]));
      this.jobsByProduct.series[0].data = data;
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
