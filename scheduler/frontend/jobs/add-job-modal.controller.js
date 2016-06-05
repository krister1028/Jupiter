export default class AddJobModalController {
  /* @ngInject */
  constructor($mdDialog, jobService, productService, jobTypeService, jobStatusService) {
    this._$mdDialog = $mdDialog;
    this._jobService = jobService;
    this.newJob = {};
    productService.getList().then(products => {
      this.products = products;
    });
    jobTypeService.getList().then(types => {
      this.jobTypes = types;
      this.newJob.type = types[0].id;
    });
    jobStatusService.getList().then(statuses => {
      this.jobStatuses = statuses;
      this.newJob.status = statuses[0].id;
    });

  }

  submitDisabled() {
    return (!this.newJob.status || !this.newJob.type || !this.newJob.description || !this.newJob.product);
  }

  cancel() {
    this._$mdDialog.cancel();
  }

  addJob() {
    this._$mdDialog.cancel();
    this._jobService.post(this.newJob);
  }

  addProduct(product) {
    this.newJob.product = product.id;
  }

  searchProducts(query) {
    if (query === '') {
      return this.products;
    }
    return this.products.filter(f => f.description.toLowerCase().indexOf(query.toLowerCase()) > -1);
  }
}
