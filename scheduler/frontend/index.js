import Highcharts from 'highcharts';
// kinda weird, but we need to define this explicitly: https://github.com/highcharts/highcharts/issues/4994
window.Highcharts = Highcharts;

import angular from 'angular';
import angularMaterial from 'angular-material';
import angularMessages from 'angular-messages';
import uiRouter from 'angular-ui-router';
import highChartsNg from 'highcharts-ng';
import loginTemplate from './login/login.html';
import headerTemplate from './header.template.html';
import LoginController from './login/login.controller';
import AddProductController from './products/add-product.controller';
import AddTaskController from './tasks/add-task.controller';
import MetricsController from './metrics/metrics.controller';
import userService from './login/user.service';
import productService from './products/product.service';
import jobService from './jobs/job.service';
import taskService from './tasks/task.service';
import groupUserService from './jobs/group-user.service';
import jobTypeService from './jobs/job-type.service';
import jobStatusService from './jobs/job-status.service';
import highchartService from './metrics/highchart.service.js';
import metricsService from './metrics/metrics.service';
import HomeController from './home.controller';
import EditJobController from './jobs/edit-job.controller';
import HeaderController from './header.controller';
import homeTemplate from './home.template.html';
import addProductTemplate from './products/add-product.template.html';
import addTaskTemplate from './tasks/add-task.template.html';
import editJobTemplate from './jobs/edit-job.template.html';
import metricsTemplate from './metrics/metrics.template.html';

const jupiter = angular
  .module('jupiter', [angularMaterial, uiRouter, angularMessages, highChartsNg])
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
  .service('metricsService', metricsService)
  .service('highchartService', highchartService)
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
          template: headerTemplate,
          controller: HeaderController,
          controllerAs: 'vm'
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
        },
        'metrics@root.home': {
          template: metricsTemplate,
          controller: MetricsController,
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
