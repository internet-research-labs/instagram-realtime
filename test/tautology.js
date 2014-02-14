var assert = require("assert");

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
  describe('#always true', function () {
    it('should be truthy', function() {
      assert([1,2,3]);
      assert(1);
      assert('whatever');
    });
  });
});
