import baseResourceClass from '../base-resource-class';

export default class productTaskService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    super($http, $q);
    this.resourceUrl = '/api/product-tasks/';
    this._postTask = 'postTask';
    this._putTask = 'putTask';
  }

  convertTaskToProductTask(task, productId) {
    task.task = task.id;
    task.id = undefined;
    task.product = productId;
    task.completion_time = task.max_completion_time;  // always default to max
    return task;
  }

  deleteTasksForProduct(product) {
    const relatedProductTasks = this.itemList.filter(i => i.product === product.id);
    return this.deleteList(relatedProductTasks);
  }

  postTasksForNewProduct(product) {
    const promiseList = [];
    product.productTasks.forEach(productTask => promiseList.push(this.post(productTask)));
    return this._$q.all(promiseList);
  }

  syncTasks(product) {
    const promiseList = [];
    let requiredAction;
    product.productTasks.forEach(productTask => {
      requiredAction = this._getRequiredAction(productTask);
      if (requiredAction === this._postTask) {
        promiseList.push(this.post(productTask));
      }
      if (requiredAction === this._putTask) {
        promiseList.push(this.put(productTask));
      }
    });
    promiseList.push(...this._removeDeletedTasks(product));
    return this._$q.all(promiseList);
  }

  _removeDeletedTasks(product) {
    const promiseList = [];
    const activeIds = product.productTasks.map(pt => pt.id);
    this.itemList.filter(productTask => {
      if (activeIds.indexOf(productTask) === -1) {
        promiseList.push(this.delete(productTask));
      }
    });
    return promiseList;
  }

  _getRequiredAction(productTask) {
    if (this.itemList.indexOf(productTask) > -1) {
      return false;  // item is unchanged
    }
    const idMap = this.itemList.map(item => item.id);
    if (idMap.indexOf(productTask.id) > -1) {  // item is changed, but exists
      return this._putTask;
    }
    return this._postTask;

  }
}
