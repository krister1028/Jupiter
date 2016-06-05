export default class ProductController {
  /* @ngInject */
  constructor(product, productService, productTaskService, $state, taskService) {
    this.product = product;
    this._taskService = taskService;
    this.unselectedTasks = [];
    this._productService = productService;
    this._$state = $state;
  }

  $onInit() {
    this._taskService.getList().then(() => this.refreshUnselectedTasks());
  }

  submit() {
    if (this._$state.$current.data.detailView) {
      this._productService.put(this.product);
    } else {
      this._productService.post(this.product);
    }
  }

  refreshUnselectedTasks() {
    const selectedTaskIds = this.product.tasks.map(t => t.id);
    this.unselectedTasks = this._taskService.itemList.filter(t => selectedTaskIds.indexOf(t.id) === -1);
  }

  searchTasks(query) {
    return this.unselectedTasks.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }

  addTask(task) {
    task.completion_time = task.max_completion_time;
    this.product.tasks.push(task);
    this.refreshUnselectedTasks();
  }
}
