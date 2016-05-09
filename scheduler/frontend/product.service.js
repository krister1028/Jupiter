export default class productService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this._productUrl = '/api/products/';
    this.products = [];
    this.loading = this.get();
  }

  get() {
    return this._$http.get(this._productUrl).then(response => this.products.push(...response.data));
  }

  post(data) {
    return this._$http.post(this._productUrl, {data});
  }
}
