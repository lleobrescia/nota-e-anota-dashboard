/**
* Alunos Controller
* @namespace Controllers
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('AlunosController', AlunosController);

  AlunosController.$inject = ['serverService', 'session', 'toastr', '$state', '$stateParams'];

  /**
	* @namespace AlunosController
	* @desc Gerencia os dados dos alunos
	* @memberOf Controllers
	*/
  function AlunosController(serverService, session, toastr, $state, $stateParams) {
    var idEscola  = session.user.idEscola;
    var self      = this;

    self.carregando   = true;
    self.listaAlunos  = [];

    /**
     * Funcoes usadas no view
     */

    self.ApagarAluno  = ApagarAluno;
    self.GoToAluno    = GoToAluno;

    Activate();

    ////////////////

    /**
		* @namespace Activate
		* @desc Startup do controlador
		* @memberOf Controllers.AlunosController
		*/
    function Activate() {
      GetDados();
      // if (session.user.listaAlunos === null) {
      //   GetDados();
      // } else {
      //   self.listaAlunos = session.user.listaAlunos;
      // }
      // self.carregando = false;
      if ($stateParams.cadastro === 'OK') {
        toastr.success('Aluno Adicionado');
      }
    }

    /**
		* @namespace ApagarAluno
		* @desc Retira o aluno do sistema
		* @param {int} index - index da lista de alunos para ser removido
		* @param {int} alunoId - id do aluno para enviar para o servidor
		* @memberOf Controllers.AlunosController
		*/
    function ApagarAluno(index, alunoId) {
      self.listaAlunos.splice(index, 1);
      session.user.listaAlunos = self.listaAlunos;

      session.SaveState();

      serverService.Request('ExcluirAluno',  { 'ObjectID': alunoId });
    }

    /**
		* @namespace GetDados
		* @desc Pega todos os alunos do servidor
		* @memberOf Controllers.AlunosController
		*/
    function GetDados() {
      serverService.Request('RecuperarDadosAlunosEscola', { 'ObjectID'  : '', 'Id_Escola' : idEscola }).then(function (resp) {
        self.listaAlunos = resp;
      });
    }

    /**
		* @namespace GoToAluno
		* @desc Direciona o usuario para a pagina do aluno solicitado
		* @param {string} alunoId - id do aluno para puxar as informacoes dele
		* @memberOf Controllers.AlunosController
		*/
    function GoToAluno(idAluno) {
      $state.go('alunosDetails', { idAluno: idAluno });
    }
  }
})();
