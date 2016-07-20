export default class HistoricalResourceChartController {
  constructor() {
    this.defaultHistoryDays = 7;
    this.endDate = this.getDefaultEndDate();
    this.startDate = this.getDefaultStartDate();
  }

  $onInit() {
    this.chart.getConfig();
    this.applyDates();
  }

  getDefaultEndDate() {
    return new Date();
  }

  getDefaultStartDate() {
    return new Date(new Date().setDate(new Date().getDate() - this.defaultHistoryDays));
  }

  applyDates() {
    return this.chart.getSeries(this.startDate, this.endDate);
  }
}
