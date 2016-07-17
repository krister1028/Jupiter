/*
This is a base class that can be extended by a child service which represents a RESTful resource.  The primary value
here is that the items are cached in memory and managed by the http verb methods below.

There are cases (for example when working with data that's paginated on the backend) where the in memory caching
provided here is undesirable, so use this class with caution.
*/

export default class baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $cacheFactory) {
    this._$q = $q;
    this._$http = $http;
    this._cache = $cacheFactory(this.constructor.name);

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
    return this._$http.get(this.resourceUrl, {cache: this._cache}).then(
      response => {
        this.itemList.length = 0;
        this.itemList.push(...this.transformResponse(response));
        return this.itemList;
      }
    );
  }

  get(id) {
    return this._$http.get(this._itemSpecificUrl(id), {cache: this._cache}).then(
      response => this.transformItem(response.data)
    );
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
        this.clearCache();
      }
    );
  }

  post(item) {
    return this._$http.post(this.resourceUrl, item).then(
      response => {
        this.clearCache();
        return this.transformItem(response.data);
      }
    );
  }

  put(item) {
    return this._$http.put(this._itemSpecificUrl(item[this.itemIdField]), item).then(
      response => {
        this.clearCache();
        return this.transformItem(response.data);
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

  clearCache() {
    this._cache.removeAll();
    this.getList();
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
