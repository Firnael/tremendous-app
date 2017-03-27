/* Directive errSrc.js */
(function() {
  'use strict';

  angular
    .module('app')
    .directive('errSrc', errSrcDirective);

  function errSrcDirective() {

    function link(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });

      attrs.$observe('ngSrc', function(value) {
        if (!value && attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }

    return {
      link: link
    };
  }
})();
