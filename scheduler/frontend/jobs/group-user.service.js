import baseResourceClass from '../base-cached-resource-class';

export default class groupUserService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $cacheFactory) {
    super($http, $q, $cacheFactory);
    this.resourceUrl = '/api/users/';
  }
}
