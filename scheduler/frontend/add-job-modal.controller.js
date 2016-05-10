export default class AddJobModalController {
  /* @ngInject */
  constructor($mdDialog, jobService) {
    this._$mdDialog = $mdDialog;
    this._jobService = jobService
  }

  cancel() {
    this._$mdDialog.cancel();
  }

  addJob() {
    this._$mdDialog.cancel();
    this._jobService.addJob();
  }
}
