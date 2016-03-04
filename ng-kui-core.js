(function () {
  'use strict';

  angular.module('ngKUICore', []);
})();
(function () {
  'use strict';

  var powers = ['k', 'm', 'g', 't', 'p', 'e', 'z', 'y'];

  function resolveDivider(id) {
    switch (id) {
    case 'i':
      return 1024;
    }

    return 1000;
  }

  angular.module('ngKUICore')
    .filter('unit', ['number', function (number) {
        return function (input, unit, decimals, mutate) {
          if (isNaN(input)) {
            return 'NaN';
          }

          var first = unit.substring(0, 1).toLowerCase();
          var second = unit.substring(1, 2);
          var power = powers.indexOf(first);
          if (power++ === -1) {
            throw 'Unknown unit';
          }

          var divider = resolveDivider(second);
          var upperCase = unit[0] === unit[0].toUpperCase();
          var value = input / Math.pow(divider, power);

          while (mutate && value > divider) {
            value = input / Math.pow(divider, ++power);
            unit = powers[power - 1] + unit.substring(1);
          }

          if (decimals) {
            value = number(value, decimals);
          }

          if (upperCase) {
            unit = unit[0].toUpperCase() + unit.substring(1);
          }

          return value + ' ' + unit;
        };
      }
    ]);
})();
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
/* global angular */
(function () {
  'use strict';

  //args are: constraintName, constraint, value, container, context
  var defaultConstraintTypes = {
    required: function (constraintName, constraint, value, container) {
      if (value instanceof Array) {
        return value.length > 0;
      }
      if (constraint instanceof Function) {
        if (!constraint(container, value)) {
          return true;
        }
      }
      return value !== null && value !== undefined && value !== '' && value !== false;
    },
    matches: function (constraintName, constraint, value, container) {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return value === container[constraint];
    },
    aggregate: function (constraintName, constraint, value, container, context) {
      var accumulator = null;
      value.forEach(function (x) {
        accumulator = constraint.op(x, accumulator);
      });

      return constraint.rule(accumulator, context);
    }
  };

  var validateProvider = [

    function ValidateProvider() {
      var self = this;
      this.constraintTypes = angular.extend({}, defaultConstraintTypes);

      this.$get = ['ValidatorConstraint', function ValidatorConstraintProvider(ValidatorConstraint) {
          return function validate(target, constraint, context) {
            var state = {};
            state.$valid = true;
            for (var c in constraint.rules) {
              if (!constraint.rules.hasOwnProperty(c)) {
                continue;
              }
              var r = constraint.rules[c];
              var enumVal = false;
              var stateTarget;
              var t;
              var newTarget;

              if (c.indexOf('[]') === c.length - 2) {
                enumVal = true;
                var arrayName = c.substring(0, c.indexOf('[]'));
                newTarget = [];
                newTarget.$valid = true;
                stateTarget = state[arrayName] = (state[arrayName] || newTarget);
                t = target[arrayName];
              } else {
                if (Array.isArray(target[c])) {
                  newTarget = [];
                  newTarget.$valid = true;
                  stateTarget = state[c] = (state[c] || newTarget);
                } else {
                  stateTarget = state[c] = (state[c] || {
                    $valid: true
                  });
                }

                t = target[c];
              }

              if (r instanceof ValidatorConstraint) {
                if (enumVal) {
                  if (t instanceof Array) {
                    for (var i = 0; i < t.length; i++) {
                      stateTarget[i] = validate(t[i], r, context);
                      if (!stateTarget[i].$valid) {
                        state.$valid = stateTarget.$valid = false;
                      }
                    }
                  }
                } else {
                  angular.extend(stateTarget, validate(t, r, context));
                  if (!stateTarget.$valid) {
                    state.$valid = false;
                  }
                }
              } else {
                for (var citem in r) {
                  stateTarget[citem] = self.constraintTypes[citem](citem, r[citem], target[c], target, context);
                  if (!stateTarget[citem]) {
                    state.$valid = stateTarget.$valid = false;
                  }
                }
              }
            }

            return state;
          };
        }
      ];
    }
  ];

  angular.module('ngKUICore')
    .provider('validate', validateProvider);
})();