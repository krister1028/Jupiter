import Highcharts from 'highcharts';
// kinda weird, but we need to define this explicitly: https://github.com/highcharts/highcharts/issues/4994
window.Highcharts = Highcharts;

import angular from 'angular';
import highChartsNg from 'highcharts-ng';
import highchartService from './highchart.service.js';
import AggregateGroupedChart from './current-metrics/aggregate-grouped-chart.component.js';
import MetricsPageComponent from './pages/metrics-page.componet';

const module = angular.module('jupiter.metrics', [highChartsNg])
  .service('highChartService', highchartService)
  .component('metricsPage', MetricsPageComponent)
  .component('aggregateGroupedChart', AggregateGroupedChart)
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('root.metrics', {
        url: '/metrics',
        data: {pageTitle: 'Metrics'},
        views: {
          'body@': {
            component: 'metricsPage'
          }
        }
      });
    $urlRouterProvider.otherwise('/');
  });

export default module.name;
