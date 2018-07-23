(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('UsuarioController', UsuarioController);

  UsuarioController.$inject = ['serverService', '$state', 'toastr','session'];
  function UsuarioController(serverService, $state, toastr,session) {
    var self = this;
    var idEscola = session.user.idEscola;

    self.edition = false;
    self.dado = {
      'Email': '',
      'IdGrupoUsuario': '',
      'Nome': '',
      'Senha': '',
      'Cpf': '',
      'Id_Escola': idEscola
    };
    //usado para quando cancelar as alteracoes feitas no self.dado
    self.dadoAux = {};
    self.request = {
      'ObjectID': '',
      'Id_Escola': idEscola
    };
    self.state = $state.current.name;

    self.Adicionar = Adicionar;
    self.Atualizar = Atualizar;
    self.CancelarEdicao = CancelarEdicao;
    self.GetCargo = GetCargo;

    Activate();

    ////////////////

    function Activate() {
      if ($state.params.idUsuario) {
        self.request.ObjectID = $state.params.idUsuario;
        GetDados();
      }
    }

    function Adicionar() {
      serverService.Request('CadastrarUsuarioEscola', self.dado).then(function (resposta) {
        $state.go('usuarios', { cadastro: 'OK' });
      });
    }

    function Atualizar() {
      serverService.Request('AtualizarDadosUsuarioEscola', self.dado).then(function (resposta) {
        toastr.success('Alterações Salvas!');
        self.edition = false;
      });
    }

    function CancelarEdicao() {
      self.dado = self.dadoAux;
      self.edition = false;
    }

    function GetCargo(idGrupoUsuario) {
      var retorno = '';
      switch (idGrupoUsuario) {
        case '0': retorno = 'Usuário';
          break;

        case '1': retorno = 'Administrador';
          break;

        default: retorno = '';
          break;
      }

      return retorno;
    }

    function GetDados() {
      serverService.Request('RetornarTodosUsuariosEscola', self.request).then(function (resposta) {
        self.dadoAux = self.dado = resposta[0];
      });
    }
  }
})();
