import baseResourceClass from '../base-cached-resource-class';

export default class jobStatusService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    super($http, $q);
    this.resourceUrl = '/api/job-statuses/';
  }

  getDescriptionList() {
    return this.itemList.map(status => status.description);
  }
}
