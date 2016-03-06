(function () {
  'use strict';

  angular.module('ngKUICore')
    .service('KConfirm', ['$uibModal', '$interpolate',
      function ($modal, $interpolate) {
        function ConfirmService(scope, options) {
          this.scope = scope;
          this.confirmPrompt = $interpolate(options.confirmPrompt);
          this.confirmTitle = $interpolate(options.confirmTitle);
          if (options.confirmButton) {
            this.confirmButton = $interpolate(options.confirmButton)(scope);
          }

          if (options.cancelButton) {
            this.cancelButton = $interpolate(options.cancelButton)(scope);
          }
        }

        ConfirmService.prototype = {
          show: function show() {
            var modal;
            var modalScope = this.scope.$new();
            modalScope.confirmButton = this.confirmButton;
            modalScope.cancelButton = this.cancelButton;
            modalScope.onConfirm = function () {
              modal.close(true);
            };

            modalScope.title = this.confirmTitle(modalScope);
            modalScope.content = this.confirmPrompt(modalScope);

            modal = $modal.open({
              templateUrl: '/kguicore/confirm.html',
              show: true,
              scope: modalScope
            });

            modal.result.
            finally(function () {
              modalScope.$destroy();
            });

            return modal.result;
          }
        };

        return ConfirmService;
      }
    ]);
})();