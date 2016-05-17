import baseFormClass from './base-form-class';

export default class AddTaskController extends baseFormClass {
  /* @ngInject */
  constructor(taskService, $state, $stateParams, $q) {
    super($stateParams, $q);
    this.paramIdName = 'taskId';
    this.resourceService = taskService;

    this._$state = $state;
    this.expertiseLevels = [
      {value: 1, description: 'Low'},
      {value: 2, description: 'Medium'},
      {value: 3, description: 'High'},
      {value: 4, description: 'CP'}
    ];
    this._getFormItem();
  }

  publishItem() {
    super.publishItem().then(() => {
      if (this.created) {
        this._$state.go('addProduct');
      } else {
        this._$state.go('home');
      }
    });
  }
}
