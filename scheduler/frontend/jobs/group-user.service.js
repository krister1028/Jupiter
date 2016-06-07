import baseResourceClass from '../base-cached-resource-class';

export default class groupUserService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    super($http, $q);
    this.resourceUrl = '/api/users/';
  }
}
