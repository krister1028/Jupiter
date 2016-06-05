export default class ChartController {

  constructor(jobService) {
    this._jobService = jobService;
  }

  $onInit() {
    this.getDefaultDates().then(() => this.refreshData());
  }

  getDefaultDates() {
    return this._jobService.getOldestJobDate().then(oldestDate => {
      this.config.startDate = oldestDate;
      this.config.endDate = new Date(); // today;
    });
  }
}
