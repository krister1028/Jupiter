export default class metricsService {
  constructor($http) {
    this._backLogUrl = '/backlog-hours/';
    this._$http = $http;
  }

  getBacklog(startDate, endDate) {
    return this._$http.get(this._backLogUrl, {params: {startDate, endDate}}).then(response => {
      const data = response.data;
      data.forEach(point => point.date = new Date(point.date).valueOf());
      return data;
    });
  }
}
