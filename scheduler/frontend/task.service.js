export default class taskService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this._getTasksUrl = '/api/tasks/';
    this.tasks = [];
    this.loading = this.get();
  }

  get() {
    return this._$http.get(this._getTasksUrl).then(response => this.tasks.push(...response.data));
  }

  post(data) {
    return this._$http.post(this._getTasksUrl, data).then(response => this.tasks.push(response.data));
  }

  patch(taskId, data) {
    return this._$http.patch(taskId, data);
  }
}
