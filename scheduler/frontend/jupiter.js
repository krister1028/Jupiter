import angular from 'angular';
import uiRouter from 'angular-ui-router';
import AppComponent from './jupiter.component';
import Components from './components/components';

const jupiter = angular
  .module('jupiter', [
    Components,
    uiRouter
  ])
  .component('jupiter', AppComponent);

export default jupiter;



///* eslint no-shadow: 0 */
//import Highcharts from 'highcharts';
//// kinda weird, but we need to define this explicitly: https://github.com/highcharts/highcharts/issues/4994
//window.Highcharts = Highcharts;
//
//import angular from 'angular';
//import angularMaterial from 'angular-material';
//import angularMessages from 'angular-messages';
//import uiRouter from 'angular-ui-router';
//import highChartsNg from 'highcharts-ng';
//import loginTemplate from './login/login.html';
//import headerTemplate from './header.template.html';
//import dateChartTemplate from './metrics/date-chart.template.html';
//import LoginController from './login/login.controller';
//import AddProductController from './products/add-product.controller';
//import AddTaskController from './tasks/add-task.controller';
//import MetricsController from './metrics/metrics.controller';
//import ChartController from './metrics/chart.controller';
//import userService from './login/user.service';
//import productService from './products/product.service';
//import jobService from './jobs/job.service';
//import taskService from './tasks/task.service';
//import jobTaskService from './jobs/job-task.service';
//import groupUserService from './jobs/group-user.service';
//import utilityService from './utility.service';
//import jobTypeService from './jobs/job-type.service';
//import jobStatusService from './jobs/job-status.service';
//import productTaskService from './products/product-task.service';
//import highchartService from './metrics/highchart.service.js';
//import metricsService from './metrics/metrics.service';
//import HomeController from './home.controller';
//import EditJobController from './jobs/edit-job.controller';
//import HeaderController from './header.controller';
//import homeTemplate from './home.template.html';
//import addProductTemplate from './products/add-product.template.html';
//import addTaskTemplate from './tasks/add-task.template.html';
//import editJobTemplate from './jobs/edit-job.template.html';
//import metricsTemplate from './metrics/metrics.template.html';
//
//const jupiter = angular
//  .module('jupiter', [angularMaterial, uiRouter, angularMessages, highChartsNg])
//  .controller('LoginController', LoginController)
//  .controller('AddProductController', AddProductController)
//  .controller('AddTaskController', AddTaskController)
//  .controller('EditJobController', EditJobController)
//  .service('userService', userService)
//  .service('productService', productService)
//  .service('jobService', jobService)
//  .service('taskService', taskService)
//  .service('groupUserService', groupUserService)
//  .service('jobTypeService', jobTypeService)
//  .service('jobStatusService', jobStatusService)
//  .service('jobTaskService', jobTaskService)
//  .service('productTaskService', productTaskService)
//  .service('metricsService', metricsService)
//  .service('highchartService', highchartService)
//  .service('utilityService', utilityService)
//  .component('dateChart', {
//    bindings: {
//      config: '=',
//      refreshData: '&'
//    },
//    template: dateChartTemplate,
//    controller: ChartController
//  })
//  .config(configuration)
//;
//
///* @ngInject */
//function configuration($stateProvider, $urlRouterProvider, $httpProvider) {
//  $stateProvider
//    .state('root', {
//      abstract: true,
//      url: '',
//      views: {
//        header: {
//          template: headerTemplate,
//          controller: HeaderController,
//          controllerAs: 'vm'
//        }
//      },
//      resolve: {user: userService => userService.getUser().then(user => user)}
//    })
//    .state('root.home', {
//      url: '/',
//      data: {pageTitle: 'Admin Home Page'},
//      views: {
//        'body@': {
//          template: homeTemplate,
//          controller: HomeController,
//          controllerAs: 'vm'
//        }
//      }
//    })
//    .state('login', {
//      url: '/login',
//      data: {pageTitle: 'Login'},
//      views: {
//        'body@': {
//          template: loginTemplate,
//          controller: 'LoginController as vm'
//        }
//      }
//    })
//    .state('root.addProduct', {
//      url: '/product',
//      data: {pageTitle: 'Add Product'},
//      views: {
//        'body@': {
//          template: addProductTemplate,
//          controller: 'AddProductController as vm'
//        }
//      },
//      resolve: {product: () => {return {tasks: [], productTasks: []};}}
//    })
//    .state('root.productDetail', {
//      url: '/product/{productId:int}',
//      data: {pageTitle: 'Add Product', detailView: true},
//      views: {
//        'body@': {
//          template: addProductTemplate,
//          controller: 'AddProductController as vm'
//        }
//      },
//      resolve: {product: (productService, $stateParams) => productService.get($stateParams.productId)}
//    })
//    .state('root.editJob', {
//      url: '/job/{jobId:int}',
//      data: {pageTitle: 'Edit Job'},
//      views: {
//        'body@': {
//          template: editJobTemplate,
//          controller: 'EditJobController as vm'
//        }
//      },
//      resolve: {job: (jobService, $stateParams) => jobService.get($stateParams.jobId)}
//
//    })
//    .state('root.addTask', {
//      url: '/task/?taskId',
//      data: {pageTitle: 'Add Task'},
//      views: {
//        'body@': {
//          template: addTaskTemplate,
//          controller: 'AddTaskController as vm'
//        }
//      }
//    })
//    .state('root.metrics', {
//      url: '/metrics',
//      data: {pageTitle: 'Metrics'},
//      views: {
//        'body@': {
//          template: metricsTemplate,
//          controller: MetricsController
//        }
//      }
//    })
//  ;
//
//  $urlRouterProvider.otherwise('/');
//
//  // CSRF
//  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
//  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
//}
//
//export default jupiter.name;
