export default class userService {
  constructor($http) {
    this.user = null;
    this.isLoggedIn = false;
    this._$http = $http;
    this._loginUrl = '/login/';
    this._userUrl = '/api/users/';
  }

  login(user) {
    return this._$http.post(this._loginUrl, {username: user.username, password: user.password}).then(response => this.user = response.data);
  }
}
