import baseFormClass from './base-form-class';

export default class AddProductController extends baseFormClass{
  /* @ngInject */
  constructor(taskService, productService, $state, $stateParams) {
    super($stateParams);
    this.paramIdName = 'productId';
    this.resourceService = productService;

    this._allTasks = [];
    this.unselectedTasks = [];
    this._productService = productService;
    this._$state = $state;

    this._getFormItem();

    // set all task times to max to start with
    taskService.get().then(tasks => {
      this._allTasks = tasks;
      this._allTasks.forEach(t => t.completion_time = t.max_completion_time);
      this.refreshUnselectedTasks();
    });

  }

  getDefaultFormItem() {
    return {tasks: []};
  }

  publishItem() {
    super.publishItem().then(() => this._$state.go('home'));
  }

  refreshUnselectedTasks() {
    const selectedTasks = this.formItem.tasks.map(t => t.task);
    this.unselectedTasks = this._allTasks.filter(at => selectedTasks.indexOf(at.id) === -1);
  }

  searchTasks(query) {
    return this._allTasks.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }

  addTask(task) {
    task.task = task.id;
    this.formItem.tasks.push(task);
  }
}
