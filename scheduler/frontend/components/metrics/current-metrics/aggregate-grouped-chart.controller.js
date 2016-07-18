export default class AggregateGroupedChartController {
  constructor(highChartService, $scope) {
    this._chartService = highChartService;
    this.config = highChartService.getColumnConfig({
      title: this.chartTitle,
      xAxisLabel: this.categoryTitle,
      yAxisLabel: this.aggregateTitle
    });
    $scope.$watch(() => this.objectList.length, () => this.getSeries());
  }

  $onChanges() {
    this.getSeries();
  }

  getSeries() {
    return this._chartService.getCategoryCount(
      this.config,
      this.objectList,
      this.seriesNameKey,
      this.categoryNameKey
    );
  }
}
