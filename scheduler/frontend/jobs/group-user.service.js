export default class groupUserService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this._groupUserUrl = '/api/users/';
    this.groupUsers = [];
    this.loading = this.get();
  }

  get() {
    return this._$http.get(this._groupUserUrl).then(response => this.groupUsers.push(...response.data));
  }
}
