export default class AggregateGroupedChartController {
  constructor(highChartService, $scope) {
    this._chartService = highChartService;
    this._$scope = $scope;
    this._$scope.$watchCollection(this.objectList, () => this.getSeries());
  }

  $onInit() {
    this.config = this._chartService.getColumnConfig({
      title: this.chartTitle,
      xAxisLabel: this.categoryTitle,
      yAxisLabel: this.aggregateTitle,
      categoryNameKey: this.categoryNameKey,
      objectList: this.objectList
    });
    this._$scope.$watch(() => this.objectList, () => this.getSeries(), true);
  }

  getSeries() {
    this._chartService.getCategoryCount(
      this.config,
      this.objectList,
      this.seriesNameKey,
      this.categoryNameKey
    );
  }
}
