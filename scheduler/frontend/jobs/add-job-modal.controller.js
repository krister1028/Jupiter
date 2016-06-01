export default class AddJobModalController {
  /* @ngInject */
  constructor($mdDialog, jobService, productService, jobTypeService, jobStatusService) {
    this._$mdDialog = $mdDialog;
    this._jobService = jobService;
    productService.getList().then(products => this.products = products);
    jobTypeService.getList().then(types => this.jobTypes = types);
    this.jobStatuses = jobStatusService.jobStatuses;
    this.newJob = {};
  }

  cancel() {
    this._$mdDialog.cancel();
  }

  addJob() {
    this._$mdDialog.cancel();
    this._jobService.post(this.newJob);
  }

  addProduct(product) {
    this.newJob.product_id = product.id;
  }

  searchProducts(query) {
    return this.products.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }
}
