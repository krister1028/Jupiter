import baseResourceClass from './base-resource-class';

export default class productService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $state) {
    super($http, $q, $state);
    this._resourceUrl = '/api/products/';
    this.taskCompleteCode = 3;
  }
}
