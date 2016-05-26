import dateChartTemplate from './date-chart.template.html';

export default () => {
  'ngInject';
  return {
    scope: {
      startDateModel: '=',
      endDateModel: '=',
      chartConfig: '='
    },
    template: dateChartTemplate
  };
};
