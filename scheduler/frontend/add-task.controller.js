export default class AddTaskController {
  /* @ngInject */
  constructor(taskService, $state) {
    this._taskService = taskService;
    this._$state = $state;
    this.expertiseLevels = [
      {value: 1, description: 'Low'},
      {value: 2, description: 'Medium'},
      {value: 3, description: 'High'}
    ];

    this.abbreviation = null;
    this.cost = null;
    this.description = null;
    this.expertiseLevel = null;
    this.minCompletionTime = null;
    this.maxCompletionTime = null;
  }

  publishTask() {
    return this._taskService.post({
      abbreviation: this.abbreviation,
      cost: this.cost,
      description: this.description,
      expertise_level: this.expertiseLevel,
      min_completion_time: this.minCompletionTime,
      max_completion_time: this.maxCompletionTime
    }).then(() => this._$state.go('addProduct'));
  }
}
