import baseResourceClass from '../base-resource-class';

export default class jobTaskService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    super($http, $q);
    this.resourceUrl = '/api/job-tasks/';
  }
}