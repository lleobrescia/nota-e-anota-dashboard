/**
* Atividade Controller
* @namespace Controllers
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('AtividadeController', AtividadeController);

  AtividadeController.$inject = ['serverService', 'session', 'toastr', '$state', '$stateParams', 'UploadImgService', '$scope'];

  /**
  * @namespace AtividadeController
  * @desc Adiciona e edita informacoes de uma atividade diaria
  * @memberOf Controllers
  */
  function AtividadeController(serverService, session, toastr, $state, $stateParams, UploadImgService, $scope) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.dado = {
      'Ano': '',
      'Descricao': '',
      'Id_Escola': idEscola,
      'Id_Turma': '',
      'Nome': ''
    };
    self.dadoAux = [];
    self.descricao = '';
    self.edition = false;
    self.id = null;
    self.imgTurma = null; //imagem enviada pelo usuario
    self.imgTurmaCortada = null; //imagem depois do crop
    self.recortou = false;
    self.requestAtividades = {
      'Id_Escola': idEscola,
      'Id_Turma': '',
      'Ano': ''
    };

    /**
     * Funcoes usadas no view
     */

    self.Adicionar = Adicionar;
    self.Atualizar = Atualizar;
    self.Cancelar = Cancelar;

    Activate();

    ////////////////

    /**
    * @namespace Activate
    * @desc Startup do controlador
    * @memberOf Controllers.AtividadeController
    */
    function Activate() {
      var d = new Date();
      self.requestAtividades.Ano = self.dado.Ano = d.getFullYear();

      angular.element(document.querySelector('#img')).on('change', HandleFileSelect);

      if ($stateParams.idTurma) {

        self.dado.Id_Turma = self.requestAtividades.Id_Turma = $stateParams.idTurma;

        if ($stateParams.idAtividade) {
          self.id = $stateParams.idAtividade;
          GetDados();
        }
      } else {
        $state.go('atividades');
      }
    }

    /**
    * @namespace Adicionar
    * @desc Adicionar uma atividade depois faz o upload da imagem da atividade
    * @memberOf Controllers.AtividadeController
    */
    function Adicionar() {
      if (!self.imgTurmaCortada) {
        toastr.error('É preciso adicionar uma imagem');
      } else {
        serverService.Request('CadastrarTemplateAtividadesDiarias', self.dado).then(function (resp) {
          /**
           * Recebe o id da atividade adicionada para fazer o upload da imagem da atividade
           * o upload eh feito atraves do servico UploadImgService
           */
          var url = 'http://52.23.250.176/webservice/WebServiceGDE.svc/UploadFotoTemplateAtividadeDiaria?id_escola=' + idEscola + '&id_atividade=' + resp.Id;
          var result = UploadImgService.UploadImage(self.imgTurmaCortada, url);

          $state.go('atividades', { cadastro: 'OK', idTurma: self.dado.Id_Turma });
        });
      }
    }

    /**
    * @namespace Atualizar
    * @desc Atualiza os dados da atividade
    * @memberOf Controllers.AtividadeController
    */
    function Atualizar() {
      serverService.Request('AtualizarTemplateAtividadesDiariasTurma', self.dado).then(function (resp) {
        toastr.success('Alterações Salvas!');
        self.edition = false;
      });
    }

    /**
    * @namespace Cancelar
    * @desc Cancela toda alteracao feita na atividade
    * @memberOf Controllers.AtividadeController
    */
    function Cancelar() {
      self.dado = self.dadoAux;
      self.imgTurmaCortada = self.dadoAux.Url_Foto;
      self.recortou = true;
      self.edition = false;
    }

    /**
    * @namespace GetDados
    * @desc Pega as informacoes da atividade
    * @memberOf Controllers.AtividadeController
    */
    function GetDados() {
      serverService.Request('RetornarTemplateAtividadesDiariasTurma', self.requestAtividades).then(function (resp) {
        angular.forEach(resp, function (item) {
          if (item.Id === self.id) {
            self.dado = self.dadoAux = item;
            self.imgTurmaCortada = item.Url_Foto;
            self.recortou = true;
          }
        });
      });
    }

    /**
    * @namespace HandleFileSelect
    * @desc Funcao usada para lidar com o upload da imagem para poder ser recortada
    * @memberOf Controllers.AtividadeController
    */
    function HandleFileSelect(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();

      reader.onload = function (evt) {
        $scope.$apply(function () {
          self.imgTurma = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    }
  }
})();
