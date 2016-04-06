export default class userService {
  constructor($http, $state) {
    this.user = {username: null, isSuperUser: false};
    this._$http = $http;
    this._$state = $state;
    this._authUrl = '/authenticate/';
    this.loading = this.getUser();
  }

  getUser() {
    return this._$http.post(this._authUrl).then(
      response => {
        this.user.username = response.data.username;
        this.user.isSuperUser = response.data.issuperuser;
      },
      response => {
        if (response.status === 401) {
          this._$state.go('login');
        }
      }
    );
  }

  login(user) {
    const f = new FormData;
    f.append('username', user.username);
    return this._$http({
      method: 'POST',
      data: f,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: this._loginUrl
    });
  }
}
