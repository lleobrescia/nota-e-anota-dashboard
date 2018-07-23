(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('MainController', MainController);

  MainController.$inject = ['serverService'];

  function MainController(serverService) {
    var self = this;

    Activate();

    ////////////////

    function Activate() {
    }
  }
})();
