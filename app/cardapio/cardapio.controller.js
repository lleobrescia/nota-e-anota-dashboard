(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CardapioController', CardapioController);

  CardapioController.$inject = ['serverService', '$state', 'toastr', 'session'];
  function CardapioController(serverService, $state, toastr, session) {
    var self = this;
    var idEscola = session.user.idEscola;

    self.dado = {
      'Data': '',
      'Descricao': '',
      'Dia': null,
      'Id_Escola': idEscola,
      'Nome': '',
      'ValorPadrao': ''
    };
    self.dadoAux = []; //usado para cancelar as alteracoes feitas
    self.edition = false;
    self.request = {
      'ObjectID': '',
      'Id_Escola': idEscola
    };
    self.state = $state.current.name;

    self.Adicionar = Adicionar;
    self.Atualizar = Atualizar;
    self.CancelarEdicao = CancelarEdicao;

    Activate();

    ////////////////

    function Activate() {
      if ($state.params.idCardapio) {
        self.request.ObjectID = $state.params.idCardapio;
        GetCardapio();
      }
    }

    function Adicionar() {
      if (!self.dado.Dia) {
        toastr.error('Por favor, adicione um dia da semana');

        return;
      }
      var date = new Date();
      date = date.getUTCDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

      self.dado.Data = date;

      serverService.Request('CadastrarTemplateCardapio', self.dado).then(function (resposta) {
        $state.go('cardapio', { cadastro: 'OK' });
      });
    }

    function Atualizar() {
      serverService.Request('AtualizarTemplateCardapio', self.dado).then(function (resposta) {
        toastr.success('Alterações Salvas!');
        self.edition = false;
      });
    }

    function CancelarEdicao() {
      self.dado = self.dadoAux;
      self.edition = false;
    }

    function GetCardapio() {
      serverService.Request('RetornarTemplateCardapio', self.request).then(function (resposta) {
        self.dado = self.dadoAux = resposta[0];
      });
    }
  }
})();
