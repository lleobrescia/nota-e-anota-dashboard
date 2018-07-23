/**
* Professores Controller
* @namespace Controllers
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ProfessoresController', ProfessoresController);

  ProfessoresController.$inject = ['serverService', 'session', 'toastr', '$state', '$stateParams'];

  /**
  * @namespace ProfessoresController
  * @desc Gerencia os dados dos professores
  * @memberOf Controllers
  */
  function ProfessoresController(serverService, session, toastr, $state, $stateParams) {
    var self = this;
    var idEscola = session.user.idEscola;

    self.carregando = true;
    self.listaProf = [];

    self.GoToProf = GoToProf;

    Activate();

    ////////////////

    /**
    * @namespace Activate
    * @desc Startup do controlador
    * @memberOf Controllers.ProfessoresController
    */
    function Activate() {
      GetProfs();
      // if (session.user.listaProf === null) {
      //   GetProfs();
      // } else {
      //   self.listaProf = session.user.listaProf;
      // }
      // self.carregando = false;

      //Mostra mensagem de sucesso quando adiciona um professor
      if ($stateParams.cadastro === 'OK') {
        toastr.success('Professor Adicionado');
      }
    }

    /**
		* @namespace ApagarProf
		* @desc Retira o professor do sistema
    * @param {int} index - index da lista de professores para ser removido
    * @param {int} profId - id do professor para enviar para o servidor
		* @memberOf Controllers.ProfessoresController
		*/
    function ApagarProf(index, profId) {
      var endpoint = {
        'ObjectID': profId
      };
      var josonRequest = 'ExcluirProfessor';

      self.listaProf.splice(index, 1);
      // session.user.listaProf = self.listaProf;

      // session.SaveState();

      serverService.Request(endpoint, josonRequest);
    }

    /**
		* @namespace GetProfs
		* @desc Pega todos os professores do servidor
		* @memberOf Controllers.ProfessoresController
		*/
    function GetProfs() {
      var endpoint = 'RecuperarDadosProfessoresEscola';
      var josonRequest = {
        'ObjectID': '',
        'Id_Escola': idEscola
      };

      serverService.Request(endpoint, josonRequest).then(function (resp) {
        self.listaProf = resp;
        console.log(self.listaProf);
        // session.user.listaProf = self.listaProf;

        // session.SaveState();

        //Adiciona a lista de turmas de cada prof
        GetTurmas();
      });
    }

    /**
		* @namespace GetTurmas
		* @desc Pega todas as turmas do professor e adiciona a lista de professores
		* @memberOf Controllers.ProfessoresController
		*/
    function GetTurmas() {
      var endpoint = 'RetornarListaTurmasPorIdProfessor';

      angular.forEach(self.listaProf, function (item) {
        var josonRequest = {
          'ObjectID': item.Id
        };
        serverService.Request(endpoint, josonRequest).then(function (resp) {
          var lista = resp;

          item.turmas = lista;
        });
      });
    }

    /**
		* @namespace GoToProf
		* @desc Direciona o usuario para a pagina do aluno solicitado
    * @param {string} idProf - id do professor para puxar as informacoes dele
		* @memberOf Controllers.ProfessoresController
		*/
    function GoToProf(idProf) {
      $state.go('professoresDetails', { idProf: idProf });
    }
  }
})();
