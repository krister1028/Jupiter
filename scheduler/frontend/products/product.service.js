import baseResourceClass from '../base-cached-resource-class';

export default class productService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, productTaskService, $cacheFactory) {
    super($http, $q, $cacheFactory);
    this.resourceUrl = '/api/products/';
    this._productTaskService = productTaskService;
  }

  post(product) {
    return super.post(product).then(() => this._productTaskService.syncTasks(product));
  }

  put(product) {
    return this._productTaskService.putUpdatedTasks(product.productTasks).then(() => {
      return this._productTaskService.syncTasks(product).then(() => super.put(product));
    });
  }

  getDescriptionList() {
    return this.itemList.map(product => product.description);
  }

  transformItem(p) {
    p.productTasks = this.getProductTasks(p);
    return p;
  }

  getProductTasks(product) {
    return this._productTaskService.itemList.filter(productTask => {
      return (product.tasks.indexOf(productTask.task) > -1 && productTask.product === product.id);
    });
  }
}
