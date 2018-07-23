(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('EscolaController', EscolaController);

  EscolaController.$inject = ['serverService', 'toastr', '$scope', '$http', 'RequestAsFormPost', 'session', 'UploadImgService'];
  function EscolaController(serverService, toastr, $scope, $http, RequestAsFormPost, session, UploadImgService) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.Atualizar = Atualizar;
    self.dado = {
      'cadastro': '',
      'cnpj': '',
      'email': '',
      'endereco': {
        'bairro': '',
        'cep': '',
        'cidade': '',
        'estado': '',
        'logradouro': '',
        'numero': ''
      },
      'nome': '',
      'site': '',
      'telefone': '',
      'texto_informativo': '',
      'Id': idEscola,
      'Link_Logo': ''
    };
    self.dadoAux = [];
    self.edition = false;
    self.img = null; //imagem enviada pelo usuario
    self.imgCortada = null; //imagem depois do crop
    self.logo = null;
    self.logoCortada = null;
    self.recortou = false;

    self.Atualizar = Atualizar;
    self.CancelarEdicao = CancelarEdicao;
    self.CancelarRecorte = CancelarRecorte;
    self.Recortar = Recortar;

    Activate();

    ////////////////

    function Activate() {
      angular.element(document.querySelector('#img')).on('change', HandleFileSelect);
      GetDados();
    }

    function Atualizar() {
      serverService.Request('AtualizarDadosEscola', self.dado).then(function (resp) {
        self.edition = false;
        toastr.success('Infromações salvas!');
      });
    }

    function CancelarEdicao() {
      self.dado = self.dadoAux;
      self.edition = false;
    }

    function CancelarRecorte() {
      if (self.dado.Link_Logo) {
        self.recortou = true;
        self.imgCortada = self.img =self.dado.Link_Logo;
      } else {
        self.recortou = false;
      }
    }

    function DataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {
        type: mimeString
      });
    }

    function GetDados() {
      serverService.Request('RetornarDadosEscolas', { 'ObjectID': idEscola }).then(function (resp) {
        self.dado = self.dadoAux = resp[0];

        if (self.dado.Link_Logo) {
          self.recortou = true;
          self.imgCortada = self.dado.Link_Logo;
        }

        console.log(self.dado);
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
          self.img = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    }

    function Recortar() {
      var url = 'http://52.23.250.176/webservice/WebServiceGDE.svc/UploadLogoEscola?id_escola=' + idEscola;
      var result = UploadImgService.UploadImage(self.imgCortada, url);
    }
  }
})();
