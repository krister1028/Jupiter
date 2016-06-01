export default class utilityService {
  getDotAttribute(dotString, object) {
    let subVal = object;
    const attributes = dotString.split('.');
    attributes.forEach(attr => {
      subVal = subVal[attr];
    });
    return subVal;
  }
}
