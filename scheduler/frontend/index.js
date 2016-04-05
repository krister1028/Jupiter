import angular from 'angular';
import angularMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import loginTemplate from './login.html';
import LoginController from './login.controller';

const jupiter = angular
  .module('jupiter', [angularMaterial, uiRouter])
  .controller('LoginController', LoginController)
  .config(configuration);

function configuration($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('login', {
      url: '/',
      template: loginTemplate,
      controller: 'LoginController as vm'
    });

  $urlRouterProvider.otherwise('/');
}

export default jupiter.name;
