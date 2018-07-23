/**
* Professor Controller
* @namespace Controllers
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ProfessorController', ProfessorController);

  ProfessorController.$inject = ['serverService', 'session', 'toastr', '$state'];

  /**
  * @namespace AlunoController
  * @desc Adiciona e edita informacoes de um aluno
  * @memberOf Controllers
  */
  function ProfessorController(serverService, session, toastr, $state) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.carregando = true;
    self.dado = {
      'Email': '',
      'Excluido': false,
      'IdGrupoUsuario': 0,
      'Nome': '',
      'Senha': '',
      'Cpf': '',
      'Id_Escola': idEscola
    };
    self.dadoAux = [];
    self.enableEdition = false;
    self.idProf = null;

    self.AdicionarProf = AdicionarProf;
    self.CancelarEdicao = CancelarEdicao;
    self.SalvarEdicao = SalvarEdicao;

    Activate();

    ////////////////

    /**
    * @namespace Activate
    * @desc Startup do controlador
    * @memberOf Controllers.ProfessorController
    */
    function Activate() {
      self.idProf = $state.params.idProf;

      if (self.idProf !== undefined) {
        GetProf();
      }

      console.log(self.idProf);
    }

    /**
    * @namespace AdicionarProf
    * @desc Adiciona o professor ao sistema
    * @memberOf Controllers.ProfessorController
    */
    function AdicionarProf() {
      self.carregando = true;

      serverService.Request('CadastrarUsuarioProfessor', self.dado).then(function (resp) {
        console.log(resp);
        $state.go('professores', { cadastro: 'OK' });
      });
    }

    /**
    * @namespace CancelarEdicao
    * @desc Cancela as alteracoes feitas pelo usuario
    * @memberOf Controllers.ProfessorController
    */
    function CancelarEdicao() {
      self.dado = self.dadoAux;
    }

    /**
    * @namespace GetProf
    * @desc Pega as informacoes do professor no servidor utilizando o id da url
    * @memberOf Controllers.ProfessorController
    */
    function GetProf() {
      serverService.Request('RecuperarDadosProfessoresEscola', { 'ObjectID': self.idProf, 'Id_Escola': idEscola }).then(function (resp) {
        self.dado = self.dadoAux = resp[0];
        console.log(self.prof);
      });
    }

    /**
    * @namespace SalvarEdicao
    * @desc Salva as informacoes editadas e envia ao servidor
    * @memberOf Controllers.ProfessorController
    */
    function SalvarEdicao() {
      serverService.Request('AtualizarDadosProfessor', self.dado).then(function (resp) {
        console.log(resp);
        toastr.success('Dados Salvos!');
      });
    }
  }
})();
