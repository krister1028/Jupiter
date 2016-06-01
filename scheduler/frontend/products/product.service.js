import baseResourceClass from '../base-resource-class';

export default class productService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    super($http, $q);
    this.resourceUrl = '/api/products/';
    this.taskCompleteCode = 3;
  }
}
