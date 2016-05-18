import angular from 'angular';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';
import uiRouter from 'angular-ui-router';
import loginTemplate from './login/login.html';
import headerTemplate from './header.template.html';
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
  .module('jupiter', [angularMaterial, uiRouter, angularMessages])
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
  .config(configuration)
  .run(run)
;

/* @ngInject */
function run($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}

/* @ngInject */
function configuration($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
    .state('root', {
      abstract: true,
      url: '',
      views: {
        header: {
          template: headerTemplate
        }
      }
    })
    .state('root.home', {
      url: '/',
      data: {pageTitle: 'Admin Welcome Page'},
      views: {
        'body@': {
          template: homeTemplate,
          controller: HomeController,
          controllerAs: 'vm'
        }
      }
    })
    .state('root.login', {
      url: '/login/',
      data: {pageTitle: 'Login'},
      views: {
        'body@': {
          template: loginTemplate,
          controller: 'LoginController as vm'
        }
      }
    })
    .state('root.addProduct', {
      url: '/add-product/?productId',
      data: {pageTitle: 'Add Product'},
      views: {
        'body@': {
          template: addProductTemplate,
          controller: 'AddProductController as vm'
        }
      }
    })
    .state('root.editJob', {
      url: '/edit-job/{jobId:int}',
      data: {pageTitle: 'Edit Job'},
      views: {
        'body@': {
          template: editJobTemplate,
          controller: 'EditJobController as vm'
        }
      }

    })
    .state('root.addTask', {
      url: '/add-task/?taskId',
      data: {pageTitle: 'Add Task'},
      views: {
        'body@': {
          template: addTaskTemplate,
          controller: 'AddTaskController as vm'
        }
      }
    })
  ;

  $urlRouterProvider.otherwise('/');

  // CSRF
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}

export default jupiter.name;
