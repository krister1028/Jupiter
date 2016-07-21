import baseHistoricalChart from './base-historical-chart-factory';

export default class historicalTimeLineChart extends baseHistoricalChart {
  constructor(highchartService, $http, title, yAxisLabel, resourceUrl) {
    super(highchartService, $http);
    this.resourceUrl = resourceUrl;
    this.title = title;
    this.yAxisLabel = yAxisLabel;
  }

  getConfig() {
    this.config = this._chartService.getTimeLineConfig(this.title, this.yAxisLabel);
    this.config.series = this.series;
  }

  getResourceData(startDate, endDate) {
    return this._$http.get(this.resourceUrl, {params: {start_date: startDate, end_date: endDate}})
      .then(response => {
        this.transformResponse(response);
        this.config.xAxis.min = startDate.getTime();
        this.config.xAxis.max = endDate.getTime();
      });
  }

  refreshSeries(series) {
    series.forEach(s => {
      s.data.map(seriesDataPoint => {
        seriesDataPoint[0] = new Date(seriesDataPoint[0]).getTime();
      });
    });
    super.refreshSeries(series);
  }
}
