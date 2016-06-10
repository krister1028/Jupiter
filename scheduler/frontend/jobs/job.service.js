import baseResourceClass from '../base-cached-resource-class';

export default class jobService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, productService, jobTypeService, jobTaskService, utilityService, jobStatusService) {
    super($http, $q);
    this._$q = $q;
    this.resourceUrl = '/api/jobs/';
    this._productService = productService;
    this._jobTypeService = jobTypeService;
    this._jobStatusService = jobStatusService;
    this._jobTaskService = jobTaskService;
    this._utilityService = utilityService;
    this.relatedServices = [jobTaskService, jobTypeService, jobStatusService];
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
    return completedTime / totalTime;
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
    const incompleteTasks = job.job_tasks.filter(t => t.status !== this.taskCompleteStatus);
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

  transformItem(j) {
    j.jobTasks = this._getJobTasks(j);
    j.productItem = this._productService.itemList.filter(product => product.id === j.product)[0];
    j.jobStatus = this._jobStatusService.itemList.filter(status => status.id === j.status)[0];
    j.jobType = this._jobTypeService.itemList.filter(type => type.id === j.type)[0];
    j.completed_timestamp = j.completed_timestamp ? new Date(j.completed_timestamp) : null;
    j.created = new Date(j.created);
    return j;
  };

  _getJobTasks(job) {
    return this._jobTaskService.itemList.filter(jobTask => {
      return (job.product_tasks.indexOf(jobTask.product_task) > -1 && job.id === jobTask.job);
    });
  }
}
