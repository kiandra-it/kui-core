(function () {
  /* globals describe, it, beforeEach, inject, expect */
  'use strict';

  describe('Confirm Service', function () {
    beforeEach(module('ngKUICore'));
    beforeEach(module('kguicore-partials'));

    it('it should resolve successfully when confirmed', function (done) {
      inject(function ($rootScope, $document, KConfirm) {
        var scope = $rootScope.$new();
        var title = 'Test',
          prompt = 'Do you?';
        var confirm = new KConfirm(scope, {
          confirmTitle: title,
          confirmPrompt: prompt
        });

        confirm.show()
          .then(function (r) {
            expect(r).toEqual(true);
            done();
          })
          .
        catch (function () {
          done(new Error('Failed'));
        });

        $rootScope.$digest();
        var button = angular.element($document[0].querySelector('body > .modal .btn-primary'));
        button.triggerHandler('click');
      });
    });

    it('it should have the provided title and content', function () {
      inject(function ($rootScope, $document, KConfirm) {
        var scope = $rootScope.$new();
        var title = 'Test',
          prompt = 'Do you?';
        var confirm = new KConfirm(scope, {
          confirmTitle: title,
          confirmPrompt: prompt
        });

        confirm.show();

        $rootScope.$digest();
        var button = angular.element($document[0].querySelector('body > .modal .btn-primary'));
        var modalScope = button.scope();
        expect(modalScope.content).toBe(prompt);
        expect(modalScope.title).toBe(title);
      });
    });

    it('it should have the provided ok and cancel button text', function () {
      inject(function ($rootScope, $document, KConfirm) {
        var scope = $rootScope.$new();
        var cancelButton = 'testcancel',
          confirmButton = 'testconfirm';
        var title = 'Test',
          prompt = 'Do you?';
        var confirm = new KConfirm(scope, {
          confirmTitle: title,
          confirmPrompt: prompt,
          cancelButton: cancelButton,
          confirmButton: confirmButton
        });

        confirm.show();

        $rootScope.$digest();
        var button = angular.element($document[0].querySelector('body > .modal .btn-primary'));
        var modalScope = button.scope();
        expect(modalScope.cancelButton).toBe(cancelButton);
        expect(modalScope.confirmButton).toBe(confirmButton);
      });
    });
  });
})();