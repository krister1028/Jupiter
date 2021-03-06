import baseResourceClass from '../base-cached-resource-class';

export default class jobTaskService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $cacheFactory) {
    super($http, $q, $cacheFactory);
    this.resourceUrl = '/api/job-tasks/';
    this.taskCompleteStatus = 3;
    this.taskIncompleteStatus = 1;
  }

  markIncomplete(task) {
    task.status = this.taskIncompleteStatus;
    task.completed_by = null;
    task.completed_time = null;
    return this.put(task);
  }

  markComplete(task, userId) {
    task.status = this.taskCompleteStatus;
    task.completed_by = userId;
    task.completed_time = new Date();
    return this.put(task);
  }
}
