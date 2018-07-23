(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('HomeController', HomeController);

  HomeController.$inject = [];
  function HomeController() {
    var self = this;


    Activate();

    ////////////////

    function Activate() { }
  }
})();
