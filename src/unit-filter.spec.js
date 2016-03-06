(function () {
  /* globals describe, it, beforeEach, inject, expect */
  'use strict';

  describe('Unit Filter', function () {
    beforeEach(module('ngKUICore'));

    it('should return NaN with non number value', function () {
      inject(function (unitFilter) {
        var result = unitFilter(undefined, 'KiB');
        expect(result).toBeNaN();
      });
    });

    it('should return the value in KiB', function () {
      inject(function (unitFilter) {
        var result = unitFilter(2048, 'KiB');
        expect(result).toBe('2 KiB');
      });
    });

    it('should mutate the value and return MiB', function () {
      inject(function (unitFilter) {
        var result = unitFilter(1048576, 'KiB', 0, true);
        expect(result).toBe('1 MiB');
      });
    });

    it('should mutate the value and return MiB rounded to 2 decimal places', function () {
      inject(function (unitFilter) {
        var result = unitFilter(1572864, 'KiB', 2, true);
        expect(result).toBe('1.50 MiB');
      });
    });

    it('should throw with unknown unit', function () {
      inject(function (unitFilter) {
        expect(function () {
          unitFilter(1572864, 'SiB');
        }).toThrow();
      });
    });
  });
})();