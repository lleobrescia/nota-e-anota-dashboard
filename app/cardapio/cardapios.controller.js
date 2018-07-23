(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CardapiosController', CardapiosController);

  CardapiosController.$inject = ['serverService', 'toastr', 'ListManagerService', '$stateParams', 'SortByService', 'session'];
  function CardapiosController(serverService, toastr, ListManagerService, $stateParams, SortByService, session) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.cardapios = [];
    self.cardapiosSelecionados = [];
    self.dados = {
      'ObjectID': '',
      'Id_Escola': idEscola
    };

    self.DeleteCardapio = DeleteCardapio;
    self.ListManagerService = ListManagerService; //servico sera usado no view
    self.SortByService = SortByService;

    Activate();

    ////////////////

    function Activate() {
      if ($stateParams.cadastro === 'OK') {
        toastr.success('Cardápio Adicionado');
      }
      GetCardapios();
    }

    function DeleteCardapio() {
      angular.forEach(self.cardapiosSelecionados, function (item) {
        serverService.Request('RemoverTemplateCardapio', { ObjectID: item.Id }).then(function (resposta) {
        });
      });
      toastr.success('Cardápio Apagado');
      self.cardapiosSelecionados = [];
      GetCardapios();
    }

    function GetCardapios() {
      serverService.Request('RetornarTemplateCardapio', self.dados).then(function (resp) {
        self.cardapios = resp;
        console.log(resp);
      });
    }
  }
})();
