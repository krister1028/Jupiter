import baseResourceClass from '../base-cached-resource-class';
export default class jobTypeService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $cacheFactory) {
    super($http, $q, $cacheFactory);
    this.resourceUrl = '/api/job-types/';
  }

  getDescriptionList() {
    return this.itemList.map(type => type.description);
  }
}
