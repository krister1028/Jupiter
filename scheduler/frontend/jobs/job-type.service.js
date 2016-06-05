import baseResourceClass from '../base-resource-class';
export default class jobTypeService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $state) {
    super($http, $q, $state);
    this.resourceUrl = '/api/job-types/';
  }

  getDescriptionList() {
    return this.itemList.map(type => type.description);
  }
}
