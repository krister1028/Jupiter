import baseResourceClass from '../base-cached-resource-class';

export default class taskService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    super($http, $q);
    this.resourceUrl = '/api/tasks/';
  }
}
