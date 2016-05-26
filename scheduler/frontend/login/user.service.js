export default class userService {
  /* @ngInject */
  constructor($http, $state) {
    this.user = {username: null, isSuperUser: false, name: null};
    this._$http = $http;
    this._$state = $state;
    this._authUrl = '/rest-auth/login/';
    this._getUserUrl = '/rest-auth/user/';
    this._logoutUrl = '/rest-auth/logout/';
  }

  getUser() {
    return this._$http.get(this._getUserUrl).then(
      response => {
        this.user.username = response.data.username;
        this.user.isSuperUser = response.data.is_superuser;
        this.user.name = `${response.data.first_name} ${response.data.last_name}`;
        this.user.userType = response.data.profile;
        return this.user;
      },
      response => {
        if (response.status === 403) {
          return this._$state.go('root.login');
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

  logOutUser() {
    return this._$http.post(this._logoutUrl);
  }
}