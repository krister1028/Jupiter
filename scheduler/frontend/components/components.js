import angular from 'angular';
import Metrics from './metrics/metrics';
import Login from './login/login';

const components = angular
  .module('jupiter.components', [
    Login
  ])
  .name;

export default components;
