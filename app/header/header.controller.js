/**
* Header Controller
* @namespace Controllers
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$location', 'session','$state'];

  /**
  * @namespace HeaderController
  * @desc Controla os aspectos do cabecalho
  * @memberOf Controllers
  */
  function HeaderController($location, session,$state) {
    var self = this;

    self.idUser = session.user.id;
    self.nomeEscola = session.user.nomeEscola;
    self.nomeUser = session.user.nome;

    self.IsActive = IsActive;
    self.Sair = Sair;

    console.log('start');

    ////////////////

    /**
    * @namespace IsActive
    * @desc Verifica a pagina atual para adicionar a classe active ao menu
    * @memberOf Controllers.HeaderController
    */
    function IsActive(viewLocation) {
      var parent = $location.path().split('/');
      return viewLocation === parent[1];
    }

    function Sair() {
      session.Remove();
      $state.go('login');
    }
  }
})();
