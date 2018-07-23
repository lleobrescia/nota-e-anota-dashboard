(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CalendarioController', CalendarioController);

  CalendarioController.$inject = ['serverService', 'toastr', 'ListManagerService', '$stateParams', 'session'];
  function CalendarioController(serverService, toastr, ListManagerService, $stateParams, session) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.calendario = [];
    self.calendarioSelecionados = [];

    self.Apagar = Apagar;
    self.ListManagerService = ListManagerService;

    Activate();

    ////////////////

    function Activate() {
      GetDados();

      if ($stateParams.cadastro === 'OK') {
        toastr.success('Item adicionado');
      }
    }

    function Apagar() {
      var texto = 'Item Apagado';

      if (self.calendarioSelecionados.length > 1) {
        texto = 'Itens Apagados';
      }

      angular.forEach(self.calendarioSelecionados, function (item) {
        serverService.Request('RemoverItemCalendarioEscolar', { 'ObjectID': item.Id });
        toastr.success(texto);
        GetDados();
      });
    }

    function GetDados() {
      serverService.Request('RetornarCalendarioEscolar', { 'ObjectID': '', 'Id_Escola': idEscola }).then(function (resp) {
        console.log(resp);
        angular.forEach(resp, function (item) {
          var data = item.Data.split('/');
          item.Data = new Date(data[2], (data[1] - 1), data[0]);
        });
        self.calendario = resp;
      });
    }
  }
})();
