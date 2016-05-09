export default class productService {
  /* @ngInject */
  constructor($http) {
    this._$http = $http;
    this._getProductUrl = '/api/products/';
    this.products = [];
    this.loading = this.getProducts();
  }

  getProducts() {
    return this._$http.get(this._getProductUrl).then(response => this.products.push(...response.data));
  }
}
