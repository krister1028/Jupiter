/*
This is a base class that can be extended by a child service which represents a RESTful resource.  The primary value
here is that the items are cached in memory and managed by the http verb methods below.

There are cases (for example when working with data that's paginated on the backend) where the in memory caching
provided here is undesirable, so use this class with caution.
*/

export default class baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    this._initialRequest = $q.defer();
    this._$q = $q;
    this._$http = $http;
    this._pristineItemList = [];  // private cache, not exposed outside of service

    this.itemList = [];
    this.resourceUrl = null;  // must be overwritten in child class
    this.itemIdField = 'id';  // may be overwritten in child class as needed
  }

  /* /////////////////////////////////////////////////////////////////////////////////////////////////////
  // HTTP verbs
  ///////////////////////////////////////////////////////////////////////////////////////////////////// */

  getList() {
    const deferred = this._$q.defer();

    if (this._initialRequest.promise.$$state.status === 0) { // if successful get request has not yet resolved
      this._$http.get(this.resourceUrl).then(
        response => {
          this._pristineItemList = [...this.transformResponse(response)];
          this._makeItemListPristine();
          deferred.resolve(this.itemList);
        },
        response => {
          deferred.reject(response.data);
        }
      );
    } else { // if items are in memory already, resolve without making request
      this._makeItemListPristine();
      deferred.resolve(this.itemList);
    }
    return deferred.promise;
  }

  get(itemId, queryParams, noCache = false) {
    if (noCache) {
      return this._$http.get(this._itemSpecificUrl(itemId), {params: queryParams})
        .then(response => this.transformResponse(response));
    }
    return this.getList().then(() => this.itemList.filter(i => i[this.itemIdField] === itemId)[0]);
  }

  deleteList(itemList) {
    const promiseList = [];
    itemList.forEach(item => {
      promiseList.push(this.delete(item, item[this.itemIdField]));
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
    this.itemList.push(item);
    return this._$http.post(this.resourceUrl, item).then(
      response => {
        this._postToPristineList(item);
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
        this._putToPristineList(item);
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
    return response.data;
  }

  /* /////////////////////////////////////////////////////////////////////////////////////////////////////
  // Public Utility Methods
  ///////////////////////////////////////////////////////////////////////////////////////////////////// */

  refreshCache() {
    this._initialRequest = this._$q.defer();
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
    this.itemList.push(...this._pristineItemList);
  }

  _putToPristineList(item) {
    const index = this._pristineItemList.indexOf(item);
    if (index > -1) {
      this._pristineItemList[index] = item;
    }
  }

  _postToPristineList(item) {
    this._pristineItemList.push(item);
  }

  _deleteFromPristineList(item) {
    const index = this._pristineItemList.indexOf(item);
    if (index > -1) {
      this._pristineItemList.splice(index, 1);
    }
  }
}
