import angular from 'angular';
import angularMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import loginTemplate from './login/login.html';
import LoginController from './login/login.controller';
import userService from './user.service';
import HomeController from './home.controller';
import homeTemplate from './home.template.html'

const jupiter = angular
  .module('jupiter', [angularMaterial, uiRouter])
  .controller('LoginController', LoginController)
  .service('userService', userService)
  .config(configuration);

function configuration($stateProvider, $urlRouterProvider, $httpProvider) {
  'ngInject';
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
    });

  $urlRouterProvider.otherwise('/');

  // CSRF
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}

export default jupiter.name;
