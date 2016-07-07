/*
This is a base class that can be extended by a child service which represents a RESTful resource.  The primary value
here is that the items are cached in memory and managed by the http verb methods below.

There are cases (for example when working with data that's paginated on the backend) where the in memory caching
provided here is undesirable, so use this class with caution.
*/
import angular from 'angular';

export default class baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    this._initialized = false;
    this._$q = $q;
    this._$http = $http;

    this.itemList = [];
    // must be overwritten in child class
    this.resourceUrl = null;
    // may be overwritten in child class as needed
    this.itemIdField = 'id';
  }

  /* /////////////////////////////////////////////////////////////////////////////////////////////////////
  // HTTP verbs
  ///////////////////////////////////////////////////////////////////////////////////////////////////// */

  getList() {
    const deferred = this._$q.defer();

    if (!this._initialized) { // if successful get request has not yet resolved
      this._$http.get(this.resourceUrl).then(
        response => {
          this._initialized = true;
          this.itemList.push(...this.transformResponse(response));
          deferred.resolve(this.itemList);
        }
      );
    } else { // if items are in memory already, resolve without making request
      deferred.resolve(this.itemList);
    }
    return deferred.promise;
  }

  get(queryParams) {
    return this.getList().then(() => this.itemList.filter(item => {
      let isMatch = true;
      Object.keys(queryParams).forEach(key => {
        if (item[key] !== queryParams[key]) {
          isMatch = false;
        }
      });
      return isMatch;
    }));
  }

  deleteList(itemList) {
    const promiseList = [];
    itemList.forEach(item => {
      promiseList.push(this.delete(item));
    });
    return this._$q.all(promiseList);
  }

  delete(item) {
    return this._$http.delete(this._itemSpecificUrl(item[this.itemIdField])).then(
      () => {
        const index = this.itemList.indexOf(item);
        this.itemList.splice(index, 1); // remove item from cached list
      }
    );
  }

  post(item) {
    return this._$http.post(this.resourceUrl, item).then(
      response => {
        const newJob = this.transformItem(response.data);
        this.itemList.push(newJob);
        return response.data;
      },
      response => {
        this.itemList.pop();
        return this._$q.reject(response.data);
      }
    );
  }

  put(item) {
    return this._$http.put(this._itemSpecificUrl(item[this.itemIdField]), item).then(
      response => {
        return this.transformItem(response.data);
      },
      response => {
        return this._$q.reject(response.data);
      }
    );
  }

  /* /////////////////////////////////////////////////////////////////////////////////////////////////////
  // Base methods (to be overwritten as needed in child class)
  ///////////////////////////////////////////////////////////////////////////////////////////////////// */

  transformResponse(response) {  // can be overwritten in child class if special response processing is needed
    const data = response.data;
    data.forEach(d => this.transformItem(d));
    return data;
  }

  transformItem(item) {
    return item;
  }

  /* /////////////////////////////////////////////////////////////////////////////////////////////////////
  // Public Utility Methods
  ///////////////////////////////////////////////////////////////////////////////////////////////////// */

  refreshCache() {
    this._initialized = false;
    return this.getList();
  }

  /* /////////////////////////////////////////////////////////////////////////////////////////////////////
  // Private utility methods
  ///////////////////////////////////////////////////////////////////////////////////////////////////// */

  _itemSpecificUrl(itemId) {  // just appends the item id to the base resource url if it exists
    if (itemId === undefined) {
      return this.resourceUrl;
    }
    return `${this.resourceUrl}${itemId}/`;
  }
}
