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
    this.getCategories();
    this.config.series.length = 0;
    this.config.series.push(...this.getSeries());
  }

  getCategories() {
    this.config.categories = this._chartService.buildCategories(this.categoryNameKey, this.objectList);
  }

  getSeries() {
    return this._chartService.getCategoryCount(
      this.objectList,
      this.categoryNameKey,
      this.seriesNameKey
    );
  }
}
