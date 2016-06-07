// Utility functions for dealing with Angular HTTP and Requests in general

export function flushHttp($httpBackend) {
  // Flush pending requests and verify we're cool
  $httpBackend.flush();
  $httpBackend.verifyNoOutstandingExpectation();
  $httpBackend.verifyNoOutstandingRequest();
}
