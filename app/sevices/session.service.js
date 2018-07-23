(function () {
  'use strict';

  angular
    .module('dashboard')
    .factory('session', session);

  session.$inject = ['$rootScope'];
  function session($rootScope) {
    var padrao = {
      id: null, // escola de exemplo.
      idEscola: null,
      nome: null,
      nomeEscola: null
    };

    var service = {
      user: padrao,
      SaveState: SaveState,
      RestoreState: RestoreState,
      Remove: Remove
    };

    $rootScope.$on('savestate', service.SaveState);
    $rootScope.$on('restorestate', service.RestoreState);

    return service;

    ////////////////
    function SaveState() {
      console.log('savestate');
      if (service.user === null) {
        service.user = padrao;
      }
      sessionStorage.Session = angular.toJson(service.user);
    }

    function RestoreState() {
      console.log('RestoreState');
      var dados = angular.fromJson(sessionStorage.Session);

      if (dados === undefined || dados === null) {
        SaveState();
      } else {
        service.user = dados;
      }
    }

    function Remove() {
      sessionStorage.Session = angular.toJson(padrao);
      service.user = padrao;
    }
  }
})();
