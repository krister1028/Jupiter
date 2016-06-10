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
    this._pristineItemList = [];  // private cache, not exposed outside of service

    this.itemList = [];

    // if populated in child class, included services getList methods will be appended to main service's getList
    this.relatedServices = [];
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
          return this._$q.all(this._getRelatedLists()).then(() => {
            this._initialized = true;
            this._pristineItemList = [...this.transformResponse(response)];
            this._makeItemListPristine();
            deferred.resolve(this.itemList);
          });
        }
      );
    } else { // if items are in memory already, resolve without making request
      this._makeItemListPristine();
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
        this._deleteFromPristineList(item);
        this.itemList.splice(index, 1); // remove item from cached list
      }
    );
  }

  post(item) {
    return this._$http.post(this.resourceUrl, item).then(
      response => {
        const newJob = this.transformItem(response.data);
        this._postToPristineList(newJob);
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
        this._putToPristineList(this.transformItem(response.data));
        return response.data;
      },
      response => {
        this._makeItemListPristine();
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

  _makeItemListPristine() {
    this.itemList.length = 0;
    this.itemList.push(...angular.copy(this._pristineItemList));
  }

  _putToPristineList(item) {
    const index = this._getPristineIndex(item[this.itemIdField]);
    if (index > -1) {
      this._pristineItemList[index] = item;
    }
  }

  _postToPristineList(item) {
    this._pristineItemList.push(item);
  }

  _deleteFromPristineList(item) {
    const index = this._getPristineIndex(item[this.itemIdField]);
    if (index > -1) {
      this._pristineItemList.splice(index, 1);
    }
  }

  _getPristineIndex(id) {
    return this._pristineItemList.findIndex(item => item[this.itemIdField] === id);
  }

  _getRelatedLists() {
    const deferredList = [];
    this.relatedServices.forEach(service => deferredList.push(service.getList()));
    return deferredList;
  }
}
