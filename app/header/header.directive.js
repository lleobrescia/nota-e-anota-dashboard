/**
* @namespace Directives
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .directive('cabecalho', Cabecalho);

  /**
  * @namespace Cabecalho
  * @desc Retorna o template do cabecalho
  * @memberOf Directives
  */
  function Cabecalho() {
    return {
      templateUrl: 'app/header/cabecalho.html',
      restrict: 'AE'
    };
  }

})();
