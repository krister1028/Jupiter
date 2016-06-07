import baseResourceClass from '../base-resource-class';

export default class productService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, productTaskService) {
    super($http, $q);
    this.resourceUrl = '/api/products/';
    this._productTaskService = productTaskService;
    this.relatedServices = [productTaskService];
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

  transformResponse(response) {
    const products = response.data;
    products.forEach(p => {
      p.productTasks = this.getProductTasks(p);
    });
    return products;
  }

  getProductTasks(product) {
    return this._productTaskService.itemList.filter(productTask => {
      return (product.tasks.indexOf(productTask.task) > -1 && productTask.product === product.id);
    });
  }
}
