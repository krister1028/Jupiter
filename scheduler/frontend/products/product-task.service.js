import baseResourceClass from '../base-resource-class';

export default class productTaskService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    super($http, $q);
    this.resourceUrl = '/api/product-tasks/';
  }
}
