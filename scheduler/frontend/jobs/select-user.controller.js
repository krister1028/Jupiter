export default class SelectUserController {
  /* @ngInject */
  constructor(groupUserService, $mdDialog) {
    this._groupUserService = groupUserService;
    this.groupUsers = groupUserService.itemList;
    this._$mdDialog = $mdDialog;
    this.selectedUser = null;
  }

  getGroupUsers() {
    return this._groupUserService.getList();
  }

  cancel() {
    this._$mdDialog.cancel();
  }

  markComplete() {
    this._$mdDialog.hide(this.selectedUser);
  }
}
