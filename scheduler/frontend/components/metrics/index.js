import Highcharts from 'highcharts';
// kinda weird, but we need to define this explicitly: https://github.com/highcharts/highcharts/issues/4994
window.Highcharts = Highcharts;

import angular from 'angular';
import highChartsNg from 'highcharts-ng';
import highchartService from './highchart.service.js';
import AggregateGroupedChart from './current-metrics/aggregate-grouped-chart.component.js';

const module = angular.module('jupiter.metrics', [highChartsNg])
  .service('highChartService', highchartService)
  .component('aggregateGroupedChart', AggregateGroupedChart);

export default module.name;
