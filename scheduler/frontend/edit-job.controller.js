import angular from 'angular';
import selectUserTemplate from './select-user.template.html';
import SelectUserController from './select-user.controller';

export default class EditJobController {
  /* @ngInject */
  constructor($stateParams, jobService, taskService, groupUserService, $mdDialog) {
    this._jobService = jobService;
    this._taskService = taskService;
    this._$mdDialog = $mdDialog;
    this.groupUsers = groupUserService.groupUsers;
    jobService.loading.then(() => {
      this.job = jobService.jobs.filter(j => j.id === $stateParams.jobId)[0];
    });
  }

  getTaskStyle(task) {
    if (task.completed_by !== null) {
      return {'text-decoration': 'line-through'};
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
    }).then(userId => this._jobService.markTaskComplete(userId, task, this.job));
  }
}
