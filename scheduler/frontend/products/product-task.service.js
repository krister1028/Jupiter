import baseResourceClass from '../base-cached-resource-class';

export default class productTaskService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $cacheFactory) {
    super($http, $q, $cacheFactory);
    this.resourceUrl = '/api/product-tasks/';
  }

  convertTaskToProductTask(task, productId) {
    task.task = task.id;
    task.id = undefined;
    task.product = productId;
    task.completion_time = task.max_completion_time;  // always default to max
    return task;
  }

  syncTasks(product) {
    const promiseList = this._postNewTasks(product.productTasks);
    promiseList.push(...this._removeDeletedTasks(product.productTasks));
    return this._$q.all(promiseList);
  }

  _postNewTasks(productTasks) {
    const promiseList = [];
    productTasks.forEach(productTask => {
      if (productTask.id === undefined) {
        promiseList.push(this.post(productTask));
      }
    });
    return promiseList;
  }

  _removeDeletedTasks(productTasks) {
    const promiseList = [];
    const activeIds = productTasks.map(pt => pt.id);
    this.itemList.forEach(productTask => {
      if (productTask.id !== undefined && activeIds.indexOf(productTask.id) === -1) {
        promiseList.push(this.delete(productTask));
      }
    });
    return promiseList;
  }

  putUpdatedTasks(productTasks) {
    const promiseList = [];
    productTasks.forEach(productTask => {
      const pristineItem = this._getPristineItem(productTask.id);
      if (productTask.id && pristineItem.completion_time !== productTask.completion_time) {
        promiseList.push(this.put(productTask));
      }
    });
    return this._$q.all(promiseList);
  }

  _getPristineItem(id) {
    return this._pristineItemList.filter(i => i.id === id)[0];
  }
}
