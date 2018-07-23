(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ItemCalendarioController', ItemCalendarioController);

  ItemCalendarioController.$inject = ['serverService', '$state', 'toastr', 'session'];
  function ItemCalendarioController(serverService, $state, toastr, session) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.dado = {
      'Data': '',
      'Descricao': '',
      'Id_Escola': idEscola,
      'Nome': '',
      'Obs': '',
      'Tag': 'C'
    };
    self.dadoAux = [];
    self.edition = false;

    self.Adicionar = Adicionar;
    self.Atualizar = Atualizar;
    self.Cancelar = Cancelar;

    Activate();

    ////////////////

    function Activate() {
      if ($state.params.idCalendario) {
        GetDado($state.params.idCalendario);
      }
    }

    function Adicionar() {
      var data = self.dado.Data.getUTCDate() + '/' + (self.dado.Data.getMonth() + 1) + '/' + self.dado.Data.getFullYear();
      self.dado.Data = data;

      serverService.Request('CadastrarCalendarioEscolar', self.dado).then(function (resp) {
        $state.go('calendario', { cadastro: 'OK' });
      });
    }

    function Atualizar() {
      var data = self.dado.Data.getUTCDate() + '/' + (self.dado.Data.getMonth() + 1) + '/' + self.dado.Data.getFullYear();
      self.dado.Data = data;

      serverService.Request('AtualizarItemCalendarioEscolar', self.dado).then(function (resp) {
        toastr.success('Alterações Salvas!');
        self.edition = false;
      });
    }

    function Cancelar() {
      self.dado = self.dadoAux;
      self.edition = false;
    }

    function GetDado(idCalendario) {
      serverService.Request('RetornarCalendarioEscolar', { 'ObjectID': idCalendario, 'Id_Escola': idEscola }).then(function (resp) {
        var item = resp[0];
        var data = item.Data.split('/');
        item.Data = new Date(data[2], (data[1] - 1), data[0]);

        self.dado = self.dadoAux = item;
        console.log(resp[0]);
      });
    }
  }
})();
