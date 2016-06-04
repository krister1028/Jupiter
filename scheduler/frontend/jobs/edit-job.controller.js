import angular from 'angular';
import selectUserTemplate from './select-user.template.html';
import SelectUserController from './select-user.controller';

export default class EditJobController {
  /* @ngInject */
  constructor($state, jobService, $mdDialog, jobTypeService, jobStatusService, jobTaskService, $stateParams) {
    // third party services
    this._$state = $state;
    this._$stateParams = $stateParams;
    this._$mdDialog = $mdDialog;
    // internal services
    this._jobService = jobService;
    this._jobTypeService = jobTypeService;
    this._jobTaskService = jobTaskService;
    this._jobStatusService = jobStatusService;
    // items
    this.jobTypes = jobTypeService.itemList;
    this.jobStatuses = jobStatusService.itemList;
    this.job = {};
    // init
    this.initializeServices();
  }

  initializeServices() {
    this._jobTypeService.getList();
    this._jobStatusService.getList();
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
    }).then(userId => this._markTaskComplete(task, userId));
  }

  _markTaskComplete(task, userId) {
    this._jobTaskService.markComplete(task, userId);
    this._jobService.checkJobComplete(this.job);
  }
}
