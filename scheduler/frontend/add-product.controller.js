import baseFormClass from './base-form-class';

export default class AddProductController extends baseFormClass{
  /* @ngInject */
  constructor(taskService, productService, $state, $stateParams) {
    super($stateParams);
    this.paramIdName = 'productId';
    this.resourceService = productService;

    this._allTasks = [];
    taskService.get().then(tasks => this._allTasks = tasks);
    this._productService = productService;
    this._$state = $state;

    // set all task times to max to start with
    taskService.get().then(() => this._allTasks.forEach(t => t.completion_time = t.max_completion_time));

    this._getFormItem();
  }

  getDefaultFormItem() {
    return {tasks: []};
  }

  publishItem() {
    super.publishItem().then(() => this._$state.go('home'));
  }

  unselectedTasks() {
    const selectedTasks = this.formItem.tasks.map(t => t.id);
    return this._allTasks.filter(t => selectedTasks.indexOf(t.id) === -1);
  }

  searchTasks(query) {
    return this._allTasks.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }

  addTask(task) {
    task.task = task.id;
    this.formItem.tasks.push(task);
  }
}
