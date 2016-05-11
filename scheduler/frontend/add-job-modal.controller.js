export default class AddJobModalController {
  /* @ngInject */
  constructor($mdDialog, jobService, productService) {
    this._$mdDialog = $mdDialog;
    this._jobService = jobService;
    this.products = productService.products;
    this.jobDescription = null;
    this.jobProduct = null;
  }

  cancel() {
    this._$mdDialog.cancel();
  }

  addJob() {
    this._$mdDialog.cancel();
    this._jobService.post({description: this.jobDescription, product_id: this.jobProduct.id});
  }

  searchProducts(query) {
    return this.products.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }
}
