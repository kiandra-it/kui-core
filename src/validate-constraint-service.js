/* global angular */
(function () {
  'use strict';

  function ValidatorConstraint(rules) {
    this.rules = rules;
  }

  angular.module('ngKUICore')
    .service('ValidatorConstraint', function () {
      return ValidatorConstraint;
    });
})();