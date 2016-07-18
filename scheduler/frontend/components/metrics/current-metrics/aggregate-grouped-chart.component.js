import template from '../chart.template.html';
import controller from './aggregate-grouped-chart.controller.js';

export default {
  bindings: {
    chartTitle: '@',
    categoryTitle: '@',
    aggregateTitle: '@',
    categoryNameKey: '@',
    seriesNameKey: '@',
    objectList: '<'
  },
  template,
  controller
};
