export default class userService {
  /* @ngInject */
  constructor($http, $state) {
    this.user = {username: null, isSuperUser: false};
    this._$http = $http;
    this._$state = $state;
    this._authUrl = '/rest-auth/login/';
    this._getUserUrl = '/rest-auth/user/';
    this.loading = this.getUser();
  }

  getUser() {
    return this._$http.get(this._getUserUrl).then(
      response => {
        this.user.username = response.data.username;
        this.user.isSuperUser = response.data.is_superuser;
      },
      response => {
        if (response.status === 403) {
          return this._$state.go('login');
        }
      }
    );
  }

  loginUser(username, password) {
    return this._$http.post(this._authUrl, {username, password}).then(
      response => {
        this.user.username = response.data.username;
        this.user.isSuperUser = response.data.is_superuser;
      }
    );
  }
}
