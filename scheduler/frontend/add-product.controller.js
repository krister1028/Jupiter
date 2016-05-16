export default class AddProductController {
  /* @ngInject */
  constructor(taskService, productService, $state) {
    this.description = null;
    this.code = null;
    this.productTasks = [];
    this._allTasks = [];
    taskService.get().then(tasks => this._allTasks = tasks);
    this._productService = productService;
    this._$state = $state;

    // set all task times to max to start with
    taskService.get().then(() => this._allTasks.forEach(t => t.completion_time = t.max_completion_time));
  }

  publishProduct() {
    this._productService.post({
      description: this.description,
      code: this.code,
      tasks: this.productTasks.map(t => {
        return {task: t.id, completion_time: t.completion_time};
      })
    }).then(
      response => {
        this._productService.products.push(response.data);
        this._$state.go('home');
      }
    );
  }

  unselectedTasks() {
    const selectedTasks = this.productTasks.map(t => t.id);
    return this._allTasks.filter(t => selectedTasks.indexOf(t.id) === -1);
  }

  searchTasks(query) {
    return this._allTasks.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }

  addTask(task) {
    this.productTasks.push(task);
  }
}
