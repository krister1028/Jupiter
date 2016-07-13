import angular from 'angular';
import angularMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import login from './login.component';
import userService from './user.service';

const jupiter = angular
  .module('jupiter.login', [
    uiRouter,
    angularMaterial
  ])
  .component('jupiter.login', login)
  .service('userService', userService)
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('login', {
        url: '/login',
        component: 'jupiter.login'
      });
    $urlRouterProvider.otherwise('/');
  })
  .name;

export default jupiter;
