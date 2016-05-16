import angular from 'angular';

export default class baseResourceClass {
  /* @ngInject */
  constructor($http, $q) {
    this._$http = $http;
    this._$q = $q;
    this._deferred = $q.defer();
    this.itemList = [];
    this._resourceUrl = null;
  }

  getItemById(itemId) {
    return this.get().then(tasks => tasks.filter(i => i.id === parseInt(itemId, 10))[0]);
  }

  get() {
    if (this._deferred.promise.$$state.status === 0) {
      this._$http.get(this._resourceUrl).then(response => {
        this.itemList.push(...response.data);
        this._deferred.resolve(this.itemList);
      });
    }
    return this._deferred.promise;
  }

  post(data) {
    return this._$http.post(this._resourceUrl, data).then(response => this.itemList.push(response.data));
  }

  put(item) {
    return this._$http.put(this._itemResourceUrl(item.id), item);
  }

  _itemResourceUrl(itemId) {
    return `${this._resourceUrl}${itemId}/`;
  }
}
