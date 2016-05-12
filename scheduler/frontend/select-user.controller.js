export default class SelectUserController {
  /* @ngInject */
  constructor(groupUserService, $mdDialog) {
    this.groupUsers = groupUserService.groupUsers;
    this._$mdDialog = $mdDialog;
    this.selectedUser = null;
  }

  cancel() {
    this._$mdDialog.cancel();
  }

  markComplete() {
    this._$mdDialog.hide(this.selectedUser);
  }
}
