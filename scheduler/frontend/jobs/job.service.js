import baseResourceClass from '../base-resource-class';

export default class jobService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, productService) {
    super($http, $q);
    this._$q = $q;
    this.resourceUrl = '/api/jobs/';
    this._productService = productService;
    this.taskCompleteStatus = 3;
    this.taskIncompleteStatus = 1;
  }

  getProgress(job) {
    let totalTime = 0;
    let remainingTime = 0;

    job.job_tasks.forEach(t => {
      totalTime += t.completion_time;
      if (t.status === this._productService.taskCompleteCode) {
        remainingTime += t.completion_time;
      }
    });
    return remainingTime / totalTime;
  }

  getJobProduct(job) {
    return this._productService.get(job.product_id).then(product => {
      job.product = product;
      return product;
    });
  }

  getAllJobProducts() {
    const promises = [];
    this.itemList.forEach(job => {
      promises.push(this.getJobProduct(job));
    });
    return this._$q.all(promises);
  }

  markTaskComplete(userId, task, job) {
    task.status = this.taskCompleteStatus;
    task.completed_by = userId;
    this.checkJobComplete(job);
    this.put(job);
  }

  markTaskIncomplete(task, job) {
    task.status = this.taskIncompleteStatus;
    task.completed_by = null;
    this.patch(job.id, {job_tasks: job.job_tasks});
  }

  setJobDescription(newDescription, jobId) {
    const job = this.itemList.filter(j => j.id === jobId)[0];
    const oldDescription = job.description;
    job.description = newDescription;
    return this.patch(jobId, {description: newDescription}).then(null, () => job.description = oldDescription);
  }

  getJobsCompletedByProduct(startDate, endDate) {
    const jobByProduct = {};
    let productName;

    return this.getAllJobProducts().then(() => {
      this.itemList.forEach(job => {
        if (job.completed_timestamp && (job.completed_timestamp >= startDate && job.completed_timestamp <= endDate)) {
          productName = job.product.description;
          if (jobByProduct.hasOwnProperty(productName)) {
            jobByProduct[productName] += 1;
          } else {
            jobByProduct[productName] = 1;
          }
        }
      });
      return jobByProduct;
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

  transformResponse(response) {
    const jobs = response.data;
    jobs.forEach(j => {
      j.completed_timestamp = j.completed_timestamp ? new Date(j.completed_timestamp) : null;
      j.created = new Date(j.created);
    });
    return jobs;
  }
}
