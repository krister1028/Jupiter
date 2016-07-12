import angular from 'angular';
import Metrics from './metrics/metrics';

const components = angular
  .module('jupiter.components', [
    Metrics
  ])
  .name;

export default components;
