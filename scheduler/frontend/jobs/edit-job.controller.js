import angular from 'angular';
import selectUserTemplate from './select-user.template.html';
import SelectUserController from './select-user.controller';

export default class EditJobController {
  /* @ngInject */
  constructor($state, jobService, $mdDialog, jobTypeService, jobStatusService, jobTaskService) {
    this._$state = $state;
    this._jobService = jobService;
    this._jobTaskService = jobTaskService;
    this._$mdDialog = $mdDialog;
    this.jobTypes = jobTypeService.itemList;
    this.jobStatuses = jobStatusService.jobStatuses;
    this._jobService.get(this._$stateParams.jobId).then(job => {
      this.job = job;
    });
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
    this._jobService.put(this.job).then(() => this._$state.go('root.home'));
  }

  deleteJob() {
    this._jobService.delete(this.job);
    this._$state.go('root.home');
  }

  toggleTask(task) {
    if (EditJobController._taskComplete(task)) {
      this._jobTaskService.markIncomplete(task);
    } else {
      this.openMarkCompleteDialog(task);
    }
  }

  openMarkCompleteDialog(task) {
    this._$mdDialog.show({
      template: selectUserTemplate,
      controller: SelectUserController,
      controllerAs: 'vm',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      locals: {job: this.job, task}
    }).then(userId => this._jobTaskService.markComplete(task, userId));
  }
}
