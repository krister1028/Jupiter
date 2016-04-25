export default class userService {
  /* @ngInject */
  constructor($http, $state) {
    this.user = {username: null, isSuperUser: false, password: null};
    this._$http = $http;
    this._$state = $state;
    this._authUrl = '/authenticate/';
    this.loading = this.getUser();
  }

  getUser() {
    if (!this.user.username) {
      return this._$state.go('login');
    }
    return this._$http.post(this._authUrl, {username: this.user.username, password: this.user.password}).then(
      response => {
        this.user.username = response.data.username;
        this.user.isSuperUser = response.data.is_superuser;
      },
      response => {
        if (response.status === 403) {
          this._$state.go('login');
        }
      }
    );
  }
}
