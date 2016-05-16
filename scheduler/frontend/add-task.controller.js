export default class AddTaskController {
  /* @ngInject */
  constructor(taskService, $state, $stateParams) {
    this._taskService = taskService;
    this._$state = $state;
    this.expertiseLevels = [
      {value: 1, description: 'Low'},
      {value: 2, description: 'Medium'},
      {value: 3, description: 'High'},
      {value: 4, description: 'CP'}
    ];

    if ($stateParams.taskId !== undefined) {
      taskService.getItemById($stateParams.taskId).then(task => {
        this.newTask = task;
      });
    } else {
      this.newTask = {};
      this.created = true;
    }
  }

  publishTask() {
    if (this.created) {
      return this._taskService.post(this.newTask).then(() => this._$state.go('addProduct'));
    }
    return this._taskService.put(this.newTask).then(() => this._$state.go('home'));
  }
}
