(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('TurmasController', TurmasController);

  TurmasController.$inject = ['session', 'serverService', '$state', '$stateParams', 'toastr'];
  function TurmasController(session, serverService, $state, $stateParams, toastr) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.listaTurmas = [];

    self.GoToTurma = GoToTurma;

    Activate();

    ////////////////

    function Activate() {
      if ($stateParams.cadastro === 'OK') {
        toastr.success('Turma Adicionado');
      }
      GetTurmas();
    }

    function ApagarTurma() { }

    function GetTurmas() {
      var endpoint = 'RecuperarDadosTurmasEscola';

      var josonRequest = {
        'ObjectID': '',
        'Id_Escola': idEscola
      };

      serverService.Request(endpoint, josonRequest).then(function (resp) {

        self.listaTurmas = resp;

        console.log(self.listaTurmas);

      });
    }

    function GoToTurma(idTurma) {
      $state.go('turmasDetails', { idTurma: idTurma });
    }
  }
})();
