export default class utilityService {
  getDotAttribute(dotString, object) {
    let subVal = object;
    const attributes = dotString.split('.');
    attributes.forEach(attr => {
      try {
        subVal = subVal[attr];
      } catch (TypeError) {
        return undefined;
      }
    });
    return subVal;
  }
}
