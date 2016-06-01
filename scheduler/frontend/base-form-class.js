export default class baseFormClass {
  constructor($stateParams, $q) {
    this._$stateParams = $stateParams;
    this._$q = $q;
    this.paramIdName = null;
    this.resourceService = null;
    this.formItem = null;
  }

  _getFormItem() {
    const deferred = this._$q.defer();
    if (this._$stateParams[this.paramIdName] !== undefined) {
      this.resourceService.get(this._$stateParams[this.paramIdName]).then(item => {
        this.formItem = item;
        deferred.resolve(this.formItem);
      });
    } else {
      this.created = true;
      this.formItem = this.getDefaultFormItem();
      deferred.resolve(this.formItem);
    }
    return deferred.promise;
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

  getSubmitText() {
    if (this.created) {
      return 'Publish';
    }
    return 'Update';
  }
}
