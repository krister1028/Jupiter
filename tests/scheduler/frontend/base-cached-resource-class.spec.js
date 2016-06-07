import angular from 'angular';
import mocks from 'angular-mocks';
import {flushHttp} from './utils/requests.js';
import BaseCachedResourceClass from '../../../scheduler/frontend/base-cached-resource-class.js';

describe('BaseCachedResourceClass', () => {

  let BaseResourceInstance;
  let httpBackend;
  let serverResponse;
  const commonValue = 'foo';
  const resourceUrl = '/test-url/';


  beforeEach(angular.mock.inject((_$q_, _$http_, _$httpBackend_) => {
    BaseResourceInstance = new BaseCachedResourceClass(_$http_, _$q_);
    BaseResourceInstance.resourceUrl = resourceUrl;
    httpBackend = _$httpBackend_;

    serverResponse = [{id: 1, name: 'thing1', commonValue}, {id: 2, name: 'thing2', commonValue}];
    httpBackend.whenGET(resourceUrl).respond(serverResponse);
  }));

  it('makes a request the first time getList is called', () => {
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList).toEqual(serverResponse);
  });

  it('makes a second request if the first one fails', () => {
    httpBackend.expectGET(resourceUrl).respond(500);
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.length).toEqual(0);
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.length).toEqual(serverResponse.length);
  });

  it('transforms response data', () => {
    const transformedResponse = ['foo', 'bar'];
    spyOn(BaseResourceInstance, 'transformResponse').and.returnValue(transformedResponse);
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    expect(BaseResourceInstance.transformResponse).toHaveBeenCalled();
    expect(BaseResourceInstance.itemList).toEqual(transformedResponse);
  });

  it('itemList is a copy of the pristine list', () => {
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    const initialPristineList = angular.copy(BaseResourceInstance._pristineItemList);
    expect(BaseResourceInstance.itemList).toEqual(BaseResourceInstance._pristineItemList);
    BaseResourceInstance.itemList = ['something', 'else'];
    expect(BaseResourceInstance._pristineItemList).toEqual(initialPristineList);
  });

  it('returns a copy of the pristine list when hitting the cache', () => {
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    const initialItemList = angular.copy(BaseResourceInstance.itemList);
    BaseResourceInstance.itemList = ['something', 'else'];
    BaseResourceInstance.getList();
    expect(BaseResourceInstance.itemList).toEqual(initialItemList);
  });

  it('does not  make a request the second time getList is called', () => {
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    BaseResourceInstance.getList();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('can get an item list by query', () => {
    const promise = BaseResourceInstance.get({name: 'thing1'}).then(response => response);
    flushHttp(httpBackend);
    const itemList = promise.$$state.value;
    expect(itemList.length).toEqual(1);
    expect(itemList[0].name).toEqual('thing1');
  });

  it('can get multiple items', () => {
    const promise = BaseResourceInstance.get({commonValue}).then(response => response);
    flushHttp(httpBackend);
    const itemList = promise.$$state.value;
    expect(itemList.length).toEqual(2);
  });

  it('will not return unmatched items', () => {
    const promise = BaseResourceInstance.get({foo: 'bar'}).then(response => response);
    flushHttp(httpBackend);
    const itemList = promise.$$state.value;
    expect(itemList.length).toEqual(0);
  });

  it('can refresh cache', () => {
    // make initial request
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList).toEqual(serverResponse);

    // refresh and verify
    const updatedResponse = ['i feel refreshed!'];
    httpBackend.expectGET(resourceUrl).respond(updatedResponse);
    BaseResourceInstance.refreshCache();
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList).toEqual(updatedResponse);
  });

  it('can build an item specific url', () => {
    expect(BaseResourceInstance._itemSpecificUrl(1)).toEqual(`${resourceUrl}1/`);
  });

  it('can delete an item', () => {
    httpBackend.whenDELETE(BaseResourceInstance._itemSpecificUrl(1)).respond(200);
    const itemToDelete = serverResponse[0];
    BaseResourceInstance.itemList = serverResponse;
    BaseResourceInstance.delete(itemToDelete);
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.indexOf(itemToDelete)).toEqual(-1);
  });

  it('will not populate zombie items on next getList', () => {
    httpBackend.whenDELETE(BaseResourceInstance._itemSpecificUrl(1)).respond(200);
    const itemToDelete = serverResponse[0];
    // populate the item
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.findIndex(i => i.id === itemToDelete.id)).toEqual(0);
    // delete it and make sure it's gone
    BaseResourceInstance.delete(itemToDelete);
    flushHttp(httpBackend);
    BaseResourceInstance.getList();
    expect(BaseResourceInstance.itemList.findIndex(i => i.id === itemToDelete.id)).toEqual(-1);
  });

  it('removes a deleted item from the pristine list', () => {
    httpBackend.whenDELETE(BaseResourceInstance._itemSpecificUrl(1)).respond(200);
    const itemToDelete = serverResponse[0];
    BaseResourceInstance._pristineItemList = serverResponse;
    BaseResourceInstance.delete(itemToDelete);
    flushHttp(httpBackend);
    expect(BaseResourceInstance._getPristineIndex(itemToDelete)).toEqual(-1);
  });

  it('will keep a deleted item in the list if the delete fails', () => {
    httpBackend.whenDELETE(BaseResourceInstance._itemSpecificUrl(1)).respond(500);
    const itemToDelete = serverResponse[0];
    BaseResourceInstance.itemList = serverResponse;
    BaseResourceInstance.delete(itemToDelete);
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.findIndex(i => i.id === itemToDelete.id)).toEqual(0);
  });

  it('can delete by custom id field', () => {
    BaseResourceInstance.itemIdField = 'customId';
    httpBackend.expectDELETE(`${resourceUrl}3/`).respond(200);
    BaseResourceInstance.delete({customId: 3});
    flushHttp(httpBackend);
  });

  it('will delete a list of items', () => {
    httpBackend.whenDELETE(BaseResourceInstance._itemSpecificUrl(1)).respond(200);
    httpBackend.whenDELETE(BaseResourceInstance._itemSpecificUrl(2)).respond(200);
    BaseResourceInstance.itemList = serverResponse;
    BaseResourceInstance.deleteList(serverResponse);
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.length).toEqual(0);
  });

  it('will not remove item list deletes that fail', () => {
    httpBackend.whenDELETE(BaseResourceInstance._itemSpecificUrl(1)).respond(200);
    httpBackend.whenDELETE(BaseResourceInstance._itemSpecificUrl(2)).respond(500);
    BaseResourceInstance.itemList = serverResponse;
    BaseResourceInstance.deleteList(serverResponse);
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.length).toEqual(1);
  });

  it('can post an item', () => {
    httpBackend.whenPOST(resourceUrl).respond(200);
    const newItem = {id: 3, name: 'new'};
    BaseResourceInstance.post(newItem);
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.pop()).toEqual(newItem);
  });

  it('will keep the item list untouched if a post fails', () => {
    httpBackend.whenPOST(resourceUrl).respond(500);
    const newItem = {id: 3, name: 'new'};
    BaseResourceInstance.post(newItem);
    flushHttp(httpBackend);
    expect(BaseResourceInstance.itemList.findIndex(i => i.id === newItem.id)).toEqual(-1);
  });

  it('can put an item', () => {
    BaseResourceInstance.getList();
    flushHttp(httpBackend);
    const itemToPut = BaseResourceInstance.itemList[0];
    itemToPut.newProp = 'krister is awesome';
    httpBackend.expectPUT(BaseResourceInstance._itemSpecificUrl(itemToPut.id)).respond(200);
    BaseResourceInstance.put(itemToPut);
    flushHttp(httpBackend);
    BaseResourceInstance.getList();
    expect(BaseResourceInstance.itemList[0].newProp).toEqual('krister is awesome');
  });

  it('can create an item specific url', () => {
    const itemId = 123;
    const expectedUrl = `${resourceUrl}${itemId}/`;
    expect(BaseResourceInstance._itemSpecificUrl(itemId)).toEqual(expectedUrl);
  });

  it('can make itemList pristine', () => {
    const pristineList = ['a', 'b', 'c'];
    BaseResourceInstance.itemList = [1, 2, 3];
    BaseResourceInstance._pristineItemList = pristineList;
    BaseResourceInstance._makeItemListPristine();
    expect(BaseResourceInstance.itemList).toEqual(pristineList);
  });

  it('can put to pristine list', () => {
    const itemToPut = serverResponse[0];
    BaseResourceInstance._pristineItemList = angular.copy(serverResponse);
    itemToPut.newProp = 'xyz';
    expect(BaseResourceInstance._pristineItemList[0].newProp).toBe(undefined);
    BaseResourceInstance._putToPristineList(itemToPut);
    expect(BaseResourceInstance._pristineItemList[0].newProp).toEqual('xyz');
  });

  it('can put to pristine list with custom id', () => {
    const itemToPut = serverResponse[0];
    itemToPut.id = undefined;
    itemToPut.customId = 0;
    BaseResourceInstance.itemIdField = 'customId';
    BaseResourceInstance._pristineItemList = angular.copy(serverResponse);
    itemToPut.newProp = 'xyz';
    expect(BaseResourceInstance._pristineItemList[0].newProp).toBe(undefined);
    BaseResourceInstance._putToPristineList(itemToPut);
    expect(BaseResourceInstance._pristineItemList[0].newProp).toEqual('xyz');
  });

  it('can post to pristine list', () => {
    const newItem = {name: 'newItem'};
    BaseResourceInstance._pristineItemList = serverResponse;
    BaseResourceInstance._postToPristineList(newItem);
    expect(BaseResourceInstance._pristineItemList.pop()).toEqual(newItem);
  });

});
