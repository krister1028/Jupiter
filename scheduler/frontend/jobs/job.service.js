import baseResourceClass from '../base-cached-resource-class';

export default class jobService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, productService, jobTypeService, jobTaskService, utilityService, jobStatusService, $cacheFactory) {
    super($http, $q, $cacheFactory);
    this._$q = $q;
    this.resourceUrl = '/api/jobs/';
    this._productService = productService;
    this._jobTypeService = jobTypeService;
    this._jobStatusService = jobStatusService;
    this._jobTaskService = jobTaskService;
    this._utilityService = utilityService;
  }

  getProgress(job) {
    let totalTime = 0;
    let completedTime = 0;

    job.jobTasks.forEach(t => {
      totalTime += t.completion_time;
      if (t.status === this._jobTaskService.taskCompleteStatus) {
        completedTime += t.completion_time;
      }
    });
    if (totalTime) {
      return completedTime / totalTime;
    }
    return 0;
  }

  getJobProduct(job) {
    return this._productService.get(job.product_id).then(product => {
      job.product = product;
      return product;
    });
  }

  getJobType(job) {
    return this._jobTypeService.get(job.type).then(type => {
      job.jobType = type;
      return type;
    });
  }

  getAllJobProducts() {
    const promises = [];
    this.itemList.forEach(job => {
      promises.push(this.getJobProduct(job));
    });
    return this._$q.all(promises);
  }

  getAllJobTypes() {
    const promises = [];
    this.itemList.forEach(job => {
      promises.push(this.getJobType(job));
    });
    return this._$q.all(promises);
  }

  setJobDescription(newDescription, jobId) {
    const job = this.itemList.filter(j => j.id === jobId)[0];
    const oldDescription = job.description;
    job.description = newDescription;
    return this.patch(jobId, {description: newDescription}).then(null, () => job.description = oldDescription);
  }

  getJobsCompletedByDateRange(startDate, endDate) {
    return this.getList().then(() => {
      return this.itemList.filter(job => (job.completed_timestamp && (job.completed_timestamp >= startDate && job.completed_timestamp <= endDate)))
    });
  }

  getJobsCreatedByDateRange(startDate, endDate) {
    return this.getList().then(() => {
      return this.itemList.filter(job => (job.created && (job.created >= startDate && job.created <= endDate)));
    });
  }

  checkJobComplete(job) {
    const incompleteTasks = job.jobTasks.filter(t => t.status !== this._jobTaskService.taskCompleteStatus);
    if (!incompleteTasks.length && !job.completed_timestamp) {
      job.completed_timestamp = new Date();
      this.put(job);
    }
  }

  getOldestJobDate() {
    let oldestDate = new Date();
    return this.getList().then(() => {
      this.itemList.forEach(job => {
        if (job.created < oldestDate) {
          oldestDate = job.created;
        }
      });
      return oldestDate;
    });
  }

  transformItem(job) {
    this._getJobTasks(job);
    this._getJobStatus(job);
    this._getProductItem(job);
    this._getJobType(job);
    job.completed_timestamp = job.completed_timestamp ? new Date(job.completed_timestamp) : null;
    job.created = new Date(job.created);
    return job;
  }

  _getJobTasks(job) {
    job.jobTasks = [];
    return this._jobTaskService.getList().then(jobTasks => {
      job.jobTasks.push(...jobTasks.filter(jobTask => job.id === jobTask.job));
    });
  }

  _getJobStatus(job) {
    return this._jobStatusService.getList().then(statusList => {
      job.jobStatus = statusList.filter(status => status.id === job.status)[0];
    });
  }

  _getProductItem(job) {
    return this._productService.getList().then(productList => {
      job.productItem = productList.filter(product => product.id === job.product)[0];
    });
  }

  _getJobType(job) {
    return this._jobTypeService.getList().then(jobTypeList => {
      job.jobType = jobTypeList.filter(type => type.id === job.type)[0];
    });
  }
}
