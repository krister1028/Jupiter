import baseResourceClass from '../base-resource-class';

export default class taskService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $state) {
    super($http, $q, $state);
    this._resourceUrl = '/api/tasks/';
  }
}
