/**
 * Conmunicacao Controller
 * @namespace Controllers
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ComunicacaoController', ComunicacaoController);

  ComunicacaoController.$inject = ['serverService', 'toastr', 'ListManagerService', 'session'];

  /**
   * @namespace ComunicacaoController
   * @desc Envia menagens para uma ou mais turmas da escola
   * @memberOf Controllers
   */
  function ComunicacaoController(serverService, toastr, ListManagerService, session) {
    var self = this;
    var idEscola = session.user.idEscola;;

    self.dado = {};
    self.turmas = [];
    self.turmasSelecionadas = [];

    self.ListManagerService = ListManagerService; // O servico eh usado no view
    self.Enviar = Enviar;

    Activate();

    ////////////////

    /**
     * @namespace Activate
     * @desc Startup do controlador
     * @memberOf Controllers.ComunicacaoController
     */
    function Activate() {
      LimparDados();
      GetTurmas();
    }

    /**
     * @namespace Enviar
     * @desc Envia a mensagem a(os) destinatarios
     * @memberOf Controllers.ComunicacaoController
     */
    function Enviar() {
      if (self.turmasSelecionadas.length === 0) {
        toastr.error('Selecione pelo menos uma turma!');
        return;
      }

      var data = self.dado.Data.getUTCDate() + '/' + (self.dado.Data.getMonth() + 1) + '/' + self.dado.Data.getFullYear();
      self.dado.Data = data;
      /**
       * Se todos as turmas forem selecionadas, nao ha necessidade de enviar para cada uma.
       * Basta enviar com o campo Id_Turma vazio.
       * Caso contrario, eh necessario colocar o id de cada turma antes de enviar 
       */
      if (ListManagerService.IsIndeterminate(self.turmasSelecionadas, self.turmas)) {
        angular.forEach(self.turmasSelecionadas, function (item) {
          self.dado.Id_Turma = item.Id;
          serverService.Request('CadastrarMensagem', self.dado).then(function (resp) {
            console.log(resp);
          });
        });
      } else {
        serverService.Request('CadastrarMensagem', self.dado).then(function (resp) {
          console.log(resp);
        });
      }
      toastr.success('Mensagem Enviada!');
      LimparDados();
    }

    /**
     * @namespace LimparDados
     * @desc Limpa os dados do formulario
     * @memberOf Controllers.ComunicacaoController
     */
    function LimparDados() {
      self.dado = {
        'Assunto': '',
        'Data': '',
        'Id_Escola': idEscola,
        'Id_Turma': '',
        'Msg': '',
        'Remetente': 'Escola',
        'Tag': 'C'
      };
      self.turmasSelecionadas = [];
    }

    /**
     * @namespace GetTurmas
     * @desc Pega todas as turmas da escola. Sao os destinatarios
     * @memberOf Controllers.ComunicacaoController
     */
    function GetTurmas() {
      var josonRequest = {
        'ObjectID': '',
        'Id_Escola': idEscola
      };
      serverService.Request('RecuperarDadosTurmasEscola', josonRequest).then(function (resp) {
        self.turmas = resp;
      });
    }

  }
})();
