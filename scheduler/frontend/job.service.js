import baseResourceClass from './base-resource-class';

export default class jobService extends baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $state, productService, taskService) {
    super($http, $q, $state);
    this._resourceUrl = '/api/jobs/';
    this._productService = productService;
    this._taskService = taskService;
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
    return this._productService.getItemById(job.product_id).then(product => product);
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

  getJobsCompletedByProduct() {
    const jobByProduct = {};
    let productName;
    // generate object with product name and job count
    this.itemList.forEach(job => {
      if (job.completed_timestamp) {
        productName = this._productService.itemList.filter(product => product.id === job.product_id)[0].description;
        if (jobByProduct.hasOwnProperty(productName)) {
          jobByProduct[productName] += 1;
        } else {
          jobByProduct[productName] = 1;
        }
      }
    });
    const returnArray = [];
    Object.keys(jobByProduct).forEach(p => returnArray.push([p, jobByProduct[p]]));
    return returnArray;
  }

  checkJobComplete(job) {
    const incompleteTasks = job.job_tasks.filter(t => t.status !== this.taskCompleteStatus);
    if (!incompleteTasks.length && !job.completed_timestamp) {
      job.completed_timestamp = new Date();
      this.put(job);
    }
  }
}
