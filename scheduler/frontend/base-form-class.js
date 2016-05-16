export default class baseFormClass {
  constructor($stateParams) {
    this._$stateParams = $stateParams;
    this.paramIdName = null;
    this.resourceService = null;
    this.formItem = this.getDefaultFormItem();
  }

  _getFormItem() {
    if (this._$stateParams[this.paramIdName] !== undefined) {
      this.resourceService.getItemById(this._$stateParams[this.paramIdName]).then(item => this.formItem = item);
    } else {
      this.created = true;
    }
  }

  getDefaultFormItem() {
    return {};
  }

  publishItem() {
    if (this.created) {
      return this.resourceService.post(this.formItem);
    }
    return this.resourceService.put(this.formItem);
  }
}
