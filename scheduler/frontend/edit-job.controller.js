import angular from 'angular';
import selectUserTemplate from './select-user.template.html';
import SelectUserController from './select-user.controller';

export default class EditJobController {
  /* @ngInject */
  constructor($state, $stateParams, jobService, taskService, groupUserService, $mdDialog, jobTypeService, jobStatusService) {
    this._$state = $state;
    this._jobService = jobService;
    this._taskService = taskService;
    this._$mdDialog = $mdDialog;
    this.groupUsers = groupUserService.groupUsers;
    this.jobTypes = jobTypeService.jobTypes;
    this.jobStatuses = jobStatusService.jobStatuses;
    jobService.getItemById($stateParams.jobId).then(job => this.job = job);
  }

  static _taskComplete(task) {
    return task.completed_by !== null;
  }

  getTaskStyle(task) {
    if (EditJobController._taskComplete(task)) {
      return {'text-decoration': 'line-through'};
    }
  }

  taskToggleText(task) {
    if (!EditJobController._taskComplete(task)) {
      return 'Mark as complete';
    }
    return 'Mark as in progress';
  }

  updateJob() {
    this._jobService.put(this.job).then(() => this._$state.go('home'));
  }

  deleteJob() {
    this._jobService.deleteJob(this.job);
    this._$state.go('home');
  }

  toggleTask(task) {
    if (EditJobController._taskComplete(task)) {
      return this._jobService.markTaskIncomplete(task, this.job);
    }
    return this.openMarkCompleteDialog(task);
  }

  openMarkCompleteDialog(task) {
    this._$mdDialog.show({
      template: selectUserTemplate,
      controller: SelectUserController,
      controllerAs: 'vm',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      locals: {job: this.job, task}
    }).then(userId => this._jobService.markTaskComplete(userId, task, this.job));
  }
}
