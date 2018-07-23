(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['serverService', 'session', 'toastr', '$state'];
  function LoginController(serverService, session, toastr, $state) {
    var self = this;

    self.dados = {
      'Email': '',
      'Senha': ''
    };

    self.Validar = Validar;

    Activate();

    ////////////////

    function Activate() {

    }

    function GetNomeEscola(idEscola) {
      serverService.Request('RetornarDadosEscolas', { 'ObjectID': idEscola }).then(function (resp) {
        session.user.nomeEscola = resp[0].nome;

        session.SaveState();
        $state.go('alunos');
      });
    }

    function Validar() {
      serverService.Request('ValidarLoginUsuarioEscola', self.dados).then(function (resp) {

        if (resp.Result) {
          session.user.id = resp.Id;
          session.user.idEscola = resp.Id_Escola;
          session.user.nome = resp.Nome;
          session.user.nomeEscola = resp.Nome_Escola;

          GetNomeEscola(resp.Id_Escola);

        } else if (!resp.Result) {
          toastr.error('Usuário ou Senha são inválidos!');
        } else {
          toastr.error('Não é possível acessar o servidor.Tente novamente mais tarde.');
        }
      });
    }
  }
})();
