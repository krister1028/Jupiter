export default class UpdateDescriptionController {
  /* @ngInject */
  constructor($mdDialog) {
    this._$mdDialog = $mdDialog;
    this.newDescription = null;
  }

  updateDescription() {
    this._$mdDialog.hide(this.newDescription);
  }

  cancel() {
    this._$mdDialog.cancel();
  }
}
