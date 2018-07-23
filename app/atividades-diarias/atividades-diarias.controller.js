(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('AtividadesController', AtividadesController);

  AtividadesController.$inject = ['serverService', 'session', 'toastr', '$state', '$stateParams', 'ListManagerService'];
  function AtividadesController(serverService, session, toastr, $state, $stateParams, ListManagerService) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.atividades = [];
    self.atividadesSelecionadas = [];
    self.turmas = [];
    self.requestAtividades = {
      'Id_Escola': idEscola,
      'Id_Turma': '',
      'Ano': ''
    };
    self.requestTurmas = {
      'ObjectID': '',
      'Id_Escola': idEscola
    };

    self.CancelarSelecao = CancelarSelecao;
    self.DeleteAtividade = DeleteAtividade;
    self.GetAtividades = GetAtividades;
    self.GoAtividade = GoAtividade;
    self.ListManagerService = ListManagerService; //service usado no view

    Activate();

    ////////////////

    function Activate() {
      var d = new Date();
      self.requestAtividades.Ano = d.getFullYear();

      GetTurmas();
      if ($stateParams.idTurma) {
        GetAtividades($stateParams.idTurma);

        if ($stateParams.cadastro === 'OK') {
          toastr.success('Atividade Cadastrada');
        }
      }
    }

    function CancelarSelecao() {
      self.requestAtividades.Id_Turma = null;
      self.atividadesSelecionadas = [];
      self.atividades = [];
    }

    function DeleteAtividade() {
      var texto = 'Atividade Excluida.';

      if (self.atividadesSelecionadas.length > 1) {
        texto = 'Atividades Excluidas.';
      }

      angular.forEach(self.atividadesSelecionadas, function (item) {
        serverService.Request('RemoverTemplateAtividadesDiariasTurma', { 'ObjectID': item.Id });
      });

      self.atividadesSelecionadas = [];
      GetAtividades($stateParams.idTurma);

      toastr.success(texto);
    }

    function GetAtividades(idTurma) {
      self.requestAtividades.Id_Turma = idTurma;
      serverService.Request('RetornarTemplateAtividadesDiariasTurma', self.requestAtividades).then(function (resp) {
        self.atividades = resp;
        console.log(resp);
      });
    }

    function GetTurmas() {
      console.log('resp');
      serverService.Request('RecuperarDadosTurmasEscola', self.requestTurmas).then(function (resp) {
        self.turmas = resp;
        console.log(resp);
      });
    }

    function GoAtividade(idAtividade) {
      $state.go('atividadesDetails', { idAtividade: idAtividade, idTurma: self.requestAtividades.Id_Turma });
    }
  }
})();
