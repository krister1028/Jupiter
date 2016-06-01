export default class MetricsController {
  constructor(highchartService, jobService) {
    this._jobService = jobService;

    this.jobsByProduct = highchartService.getCategoryConfig({
      title: 'Jobs Completed By Product',
      xAxisLabel: 'Product',
      yAxisLabel: 'Job Count'});
    this.jobsByType = highchartService.getCategoryConfig({
      title: 'Jobs Completed By Product',
      xAxisLabel: 'Product',
      yAxisLabel: 'Job Count'});
    this._allCharts = [this.jobsByProduct, this.jobsByType];
    this.getDefaultDates().then(() => this.getChartData());
  }

  getChartData() {
    this.getJobsByProductData();
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
}
