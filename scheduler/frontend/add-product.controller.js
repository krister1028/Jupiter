export default class AddProductController {
  /* @ngInject */
  constructor(taskService, productService) {
    this.description = null;
    this.code = null;
    this.productTasks = [];
    this._allTasks = taskService.tasks;
    this._productService = productService;
  }

  publishProduct() {
    this._productService.post({description: this.description, code: this.code, tasks: this.productTasks});
  }

  unselectedTasks() {
    const selectedTasks = this.productTasks.map(t => t.id);
    return this._allTasks.filter(t => selectedTasks.indexOf(t.id) === -1);
  }

  searchTasks(query) {
    return this._allTasks.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }
}
