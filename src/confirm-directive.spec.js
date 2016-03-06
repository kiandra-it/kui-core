(function () {
  /* globals describe, it, beforeEach, inject, expect */
  'use strict';

  describe('Confirm Directive', function () {
    beforeEach(module('ngKUICore'));
    beforeEach(module('kguicore-partials'));

    it('should trigger the modal when clicked', function () {
      inject(function ($compile, $rootScope, $document) {
        var scope = $rootScope.$new();
        var element = angular.element('<button kui-confirm confirm-title="Test Title" confirm-prompt="Test Prompt"><button>');
        var el = $compile(element)(scope);

        el.triggerHandler('click');
        $rootScope.$digest();

        var button = $document[0].querySelector('body > .modal .btn-primary');
        expect(button).not.toBeNull();
      });
    });

    it('should trigger the modal with the provided text', function () {
      inject(function ($compile, $rootScope, $document) {
        var scope = $rootScope.$new();
        var element = angular.element('<button kui-confirm confirm-title="Test Title" confirm-prompt="Test Prompt"><button>');
        var el = $compile(element)(scope);

        el.triggerHandler('click');
        $rootScope.$digest();

        var button = $document[0].querySelector('body > .modal .btn-primary');
        var buttonScope = angular.element(button).scope();

        expect(buttonScope.title).toBe('Test Title');
        expect(buttonScope.content).toBe('Test Prompt');
      });
    });

    it('should execute the provided action', function (done) {
      inject(function ($compile, $rootScope, $document) {
        var scope = $rootScope.$new();
        scope.confirmed = function () {
          done();
        };
        var element = angular.element('<button kui-confirm confirm-title="Test Title" confirm-prompt="Test Prompt" confirm-action="confirmed()"><button>');
        var el = $compile(element)(scope);

        el.triggerHandler('click');
        $rootScope.$digest();

        var button = angular.element($document[0].querySelector('body > .modal .btn-primary'));

        button.triggerHandler('click');
      });
    });

    it('should execute the provided rejection action', function (done) {
      inject(function ($compile, $rootScope, $document) {
        var scope = $rootScope.$new();
        scope.rejected = function () {
          done();
        };
        var element = angular.element('<button kui-confirm confirm-title="Test Title" confirm-prompt="Test Prompt" reject-action="rejected()"><button>');
        var el = $compile(element)(scope);

        el.triggerHandler('click');
        $rootScope.$digest();

        var button = angular.element($document[0].querySelector('body > .modal .btn-default'));

        button.triggerHandler('click');
      });
    });
  });
})();