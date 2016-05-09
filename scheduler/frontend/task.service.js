export default class taskService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this._getTasksUrl = '/api/tasks/';
    this.tasks = [];
    this.loading = this.getTasks();
    this._taskCompleteCode = 3;
  }

  getTasks() {
    return this._$http.get(this._getTasksUrl).then(response => this.tasks.push(...response.data));
  }
}
