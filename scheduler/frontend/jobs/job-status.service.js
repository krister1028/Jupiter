import baseResourceClass from '../base-cached-resource-class';

export default class jobStatusService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $cacheFactory) {
    super($http, $q, $cacheFactory);
    this.resourceUrl = '/api/job-statuses/';
  }

  getDescriptionList() {
    return this.itemList.map(status => status.description);
  }
}
