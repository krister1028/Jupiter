export default class MetricsController {
  constructor() {
    this.chartUrls = ['/abc/'];
    this.defaultHistoryDays = 7;
    this.endDate = this.getDefaultEndDate();
    this.startDate = this.getDefaultStartDate();
  }

  getDefaultEndDate() {
    return new Date();
  }

  getDefaultStartDate() {
    return new Date(new Date().setDate(new Date().getDate() - this.defaultHistoryDays));
  }
}
