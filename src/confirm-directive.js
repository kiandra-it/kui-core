(function () {
  'use strict';

  angular.module('ngKUICore')
    .directive('kuiConfirm', ['$uibModal', '$interpolate', 'KConfirm',
      function ($modal, $interpolate, KConfirm) {
        return {
          restrict: 'A',
          link: function ($scope, $element, $attr) {
            var confirm = new KConfirm($scope, {
              confirmButton: $attr.confirmButton,
              cancelButton: $attr.cancelButton,
              confirmTitle: $attr.confirmTitle,
              confirmPrompt: $attr.confirmPrompt
            });

            function onBeforeConfirm($event) {
              confirm.show()
                .then(function () {
                  $scope.$eval($attr.confirmAction);
                })
                .
              catch (function () {
                if ($attr.rejectAction) {
                  $scope.$eval($attr.rejectAction);
                }
              });
              $event.stopPropagation();
            }

            $element.on('click', onBeforeConfirm);
          }
        };
      }
    ]);
})();