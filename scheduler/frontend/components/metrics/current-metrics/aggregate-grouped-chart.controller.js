export default class AggregateGroupedChartController {
  constructor(highChartService) {
    this._chartService = highChartService;
    this.config = highChartService.getColumnConfig({
      title: this.chartTitle,
      xAxisLabel: this.categoryTitle,
      yAxisLabel: this.aggregateTitle
    });
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
