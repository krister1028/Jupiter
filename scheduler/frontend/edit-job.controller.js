import angular from 'angular';
import selectUserTemplate from './select-user.template.html';
import SelectUserController from './select-user.controller';
import updateDescriptionTemplate from './update-description.template.html';
import UpdateDescriptionController from './update-description.controller';

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
    jobService.loading.then(() => {
      this.job = jobService.jobs.filter(j => j.id === $stateParams.jobId)[0];
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

  updateJobDescription() {
    this._$mdDialog.show({
      template: updateDescriptionTemplate,
      controller: UpdateDescriptionController,
      locals: {jobId: this.job.id},
      controllerAs: 'vm'
    }).then(newDescription => this._jobService.setJobDescription(newDescription, this.job.id));
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
