(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PedagogicoController', PedagogicoController);

  PedagogicoController.$inject = ['serverService', 'session', '$state', '$stateParams', 'toastr', '$filter'];
  function PedagogicoController(serverService, session, $state, $stateParams, toastr, $filter) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.camposExperiencia = [];
    self.dado = {
      'DataCadastro': '',
      'Descricao': '',
      'Id_Escola': idEscola,
      'Id_SubGrupoEtario': null,
      'Id_Turma': '',
      'Nome': '',
      'Questionario': []
    };
    self.grupoEtario = [];
    self.nomeGrupoEtario = null;
    self.objetivoAprendizagem = [];
    self.questionario = [];
    self.turma = null;
    self.requestAvaliacoes = {
      'Id_Escola': idEscola,
      'Id_Turma': '',
      'Id': null
    };
    self.requestTurmas = {
      'ObjectID': '',
      'Id_Escola': idEscola
    };

    self.Adicionar = Adicionar;
    self.GetNomeCampoExperiencia = GetNomeCampoExperiencia;
    self.GetNomeObjetivo = GetNomeObjetivo;
    self.ToggleObjetivo = ToggleObjetivo;

    Activate();

    ////////////////

    function Activate() {
      if ($stateParams.idTurma) {

        self.requestAvaliacoes.Id_Turma =
          self.requestTurmas.ObjectID =
          self.dado.Id_Turma =
          $stateParams.idTurma;

        GetAtributos();
        GetTurma();

        if ($stateParams.idAvaliacao) {
          self.requestAvaliacoes.Id = $stateParams.idAvaliacao;
          GetDados();
        }
      } else {
        $state.go('pedagogico');
      }
    }

    function Adicionar() {
      var data = new Date();
      var cadastro = $filter('date')(data, 'dd/MM/yyyy');

      self.dado.DataCadastro = cadastro;
      self.dado.Questionario = self.questionario;
      serverService.Request('CadastrarAvaliacaoPedagogica', self.dado).then(function (resp) {
        $state.go('pedagogico', { cadastro: 'OK', idTurma: self.requestAvaliacoes.Id_Turma });
        console.log(resp);
      });
    }

    function GetAtributos() {
      serverService.Request('RetornarAtributosAvaliacaoPedagogica', self.requestAvaliacoes).then(function (resp) {
        self.camposExperiencia = resp.Campos_Experiencia;
        self.objetivoAprendizagem = resp.Objetivos_Aprendizagem;
        self.grupoEtario = resp.SubGrupo_Etario;

        if (self.dado.Id_SubGrupoEtario) {
          GetNomeGrupoEtario(self.dado.Id_SubGrupoEtario);
        }

        angular.forEach(self.objetivoAprendizagem, function (item) {
          item.selected = false;
        });

        console.log(resp);
      });
    }

    function GetDados() {
      serverService.Request('RetornarAvaliacoesPedagogicasPorIdTurma', self.requestAvaliacoes).then(function (resp) {
        self.dado = resp[0];
        console.log(self.dado);
      });
    }

    function GetNomeCampoExperiencia(codigo) {
      var retorno = '';

      angular.forEach(self.camposExperiencia, function (item) {
        if (item.Codigo === codigo) {
          retorno = item.Descricao;
        }
      });

      return retorno;
    }

    function GetNomeGrupoEtario(id) {
      angular.forEach(self.grupoEtario, function (item) {
        if (item.Codigo.toString() === id.toString()) {
          self.nomeGrupoEtario = item.Descricao;
        }
      });
    }

    function GetNomeObjetivo(codigo) {
      var retorno = '';

      angular.forEach(self.objetivoAprendizagem, function (item) {
        if (item.Codigo === codigo) {
          retorno = item.Descricao;
        }
      });

      return retorno;
    }

    function GetTurma() {
      serverService.Request('RecuperarDadosTurmasEscola', self.requestTurmas).then(function (resp) {
        self.turma = resp[0];
      });
    }

    function ToggleObjetivo(experiencia, objetivo) {
      var hasExperiencia = false;//para verificar se ja existe a experiencia

      angular.forEach(self.questionario, function (item, index) {

        //Se a experiencia ja existe, so adiciona o objetivo
        if (item.CampoExperiencia === experiencia) {
          var hasObjetivo = false;// para verificar se ja existe o objetivo
          hasExperiencia = true;//confirma a existencia da experiencia

          //Verificacao da existencia do objetivo
          angular.forEach(item.ObjetivoAprendizagem, function (value, key) {
            //Se existe, entao remove do array
            if (value === objetivo) {
              item.ObjetivoAprendizagem.splice(key, 1);
              hasObjetivo = true;//confirmacao da existencia do objetivo
            }
          });

          //Se nao existe o objetivo, entao adiciona
          if (!hasObjetivo) {
            item.ObjetivoAprendizagem.push(objetivo);
          } else if (hasObjetivo) {
            //Verifica se todos os objetivos foram retirados, para remover a experiencia
            if (item.ObjetivoAprendizagem.length === 0) {
              self.questionario.splice(index, 1);
            }
          }
        }
      });

      /**
       * Adiciona experiencia e o objetivo ao questionario
       * caso a experiencia nao exista
       */
      if (!hasExperiencia) {
        self.questionario.push({
          'CampoExperiencia': experiencia,
          'ObjetivoAprendizagem': [
            objetivo
          ]
        });
      }

      console.log(self.questionario);
    }
  }
})();
