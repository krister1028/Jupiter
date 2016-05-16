export default class baseResourceClass {
  /* @ngInject */
  constructor($http, $q, $state) {
    this._$http = $http;
    this._$q = $q;
    this._$state = $state;
    this._deferred = $q.defer();
    this.itemList = [];
    this._resourceUrl = null;
  }

  getItemById(itemId) {
    return this.get().then(tasks => tasks.filter(i => i.id === parseInt(itemId, 10))[0]);
  }

  get() {
    if (this._deferred.promise.$$state.status === 0) {
      this._$http.get(this._resourceUrl).then(
        response => {
          this.itemList.push(...response.data);
          this._deferred.resolve(this.itemList);
        },
        response => {
          if (response.status === 403) {
            return this._$state.go('login');
          }
        });
    }
    return this._deferred.promise;
  }

  post(data) {
    this.itemList.push(data);
    return this._$http.post(this._resourceUrl, data).then(null, () => this.itemList.pop());
  }

  put(item) {
    return this._$http.put(this._itemResourceUrl(item.id), item);
  }

  delete(item) {
    this.itemList.splice(this.itemList.indexOf(item), 1);
    return this._$http.delete(this._itemResourceUrl(item.id));
  }

  patch(itemId, data) {
    return this._$http.patch(this._itemResourceUrl(itemId), data);
  }

  _itemResourceUrl(itemId) {
    return `${this._resourceUrl}${itemId}/`;
  }
}
