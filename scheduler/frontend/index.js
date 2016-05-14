import angular from 'angular';
import angularMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import loginTemplate from './login/login.html';
import LoginController from './login/login.controller';
import AddProductController from './add-product.controller';
import AddTaskController from './add-task.controller';
import userService from './user.service';
import productService from './product.service';
import jobService from './job.service';
import taskService from './task.service';
import groupUserService from './group-user.service';
import jobTypeService from './job-type.service';
import jobStatusService from './job-status.service';
import HomeController from './home.controller';
import EditJobController from './edit-job.controller';
import homeTemplate from './home.template.html';
import addProductTemplate from './add-product.template.html';
import addTaskTemplate from './add-task.template.html';
import editJobTemplate from './edit-job.template.html';

const jupiter = angular
  .module('jupiter', [angularMaterial, uiRouter])
  .controller('LoginController', LoginController)
  .controller('AddProductController', AddProductController)
  .controller('AddTaskController', AddTaskController)
  .controller('EditJobController', EditJobController)
  .service('userService', userService)
  .service('productService', productService)
  .service('jobService', jobService)
  .service('taskService', taskService)
  .service('groupUserService', groupUserService)
  .service('jobTypeService', jobTypeService)
  .service('jobStatusService', jobStatusService)
  .config(configuration);

/* @ngInject */
function configuration($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      template: homeTemplate,
      controller: HomeController,
      controllerAs: 'vm'
    })
    .state('login', {
      url: '/login/',
      template: loginTemplate,
      controller: 'LoginController as vm'
    })
    .state('addProduct', {
      url: '/add-product/',
      template: addProductTemplate,
      controller: 'AddProductController as vm'
    })
    .state('editJob', {
      url: '/edit-job/{jobId:int}',
      template: editJobTemplate,
      controller: 'EditJobController as vm'
    })
    .state('addTask', {
      url: '/add-task/',
      template: addTaskTemplate,
      controller: 'AddTaskController as vm'
    })
  ;

  $urlRouterProvider.otherwise('/');

  // CSRF
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}

export default jupiter.name;
