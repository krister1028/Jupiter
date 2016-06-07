export default class ProductController {
  /* @ngInject */
  constructor(product, productService, $state, taskService, productTaskService) {
    this.product = product;
    this._taskService = taskService;
    this.unselectedTasks = [];
    this._productService = productService;
    this._productTaskService = productTaskService;
    this._$state = $state;
  }

  $onInit() {
    this._taskService.getList().then(() => this._refreshTaskSelection());
  }

  submit() {
    if (this._$state.$current.data.detailView) {
      this._productService.put(this.product);
    } else {
      this._productService.post(this.product);
    }
    this._$state.go('root.home');
  }

  _refreshTaskSelection() {
    const selectedTasks = this.product.productTasks.map(pt => pt.id);
    this.unselectedTasks = this._taskService.itemList.filter(t => selectedTasks.indexOf(t.id) === -1);
  }

  searchTasks(query) {
    return this.unselectedTasks.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }

  addTask(task) {
    this.product.productTasks.push(this._productTaskService.convertTaskToProductTask(task, this.product.id));
    this._refreshTaskSelection();
  }

  removeTask() {
    this._refreshTaskSelection();
  }
}
