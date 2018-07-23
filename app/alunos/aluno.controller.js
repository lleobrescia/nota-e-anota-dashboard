/**
* Aluno Controller
* @namespace Controllers
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('AlunoController', AlunoController);

  AlunoController.$inject = ['serverService', 'session', 'toastr', '$state', 'SortByService'];

  /**
  * @namespace AlunoController
  * @desc Adiciona e edita informacoes de um aluno
  * @memberOf Controllers
  */
  function AlunoController(serverService, session, toastr, $state, SortByService) {
    var idEscola  = session.user.idEscola;
    var self      = this;

    self.avaliacoes     = [];
    self.dadoAdicionar  = {
      'Data_Nascimento'   : '',
      'Email_Responsavel' : '',
      'Excluido'          : false,
      'Id_Escola'         : idEscola,
      'Matricula'         : '',
      'Nome'              : '',
      'SenhaAppPai'       : '',
      'Sexo'              : ''
    };
    self.dado     = [];
    self.dadoAux  = []; // usado para quando cancelar as modificacoes
    self.edition  = true;
    self.graficos = [];
    self.parecer  = [];
    self.request  = {
      'ObjectID'  : '',
      'Id_Escola' : idEscola
    };
    self.requestAvaliacao = {
      'Id_Escola' : idEscola,
      'Id_Turma'  : '',
      'Id_Aluno'  : ''
    };

    /**
     * Funcoes usadas no view
     */

    self.Adicionar      = Adicionar;
    self.Atualizar      = Atualizar;
    self.Cancelar       = Cancelar;
    self.MountChart     = MountChart;
    self.SortByService  = SortByService; //servico usado no view

    Activate();

    ////////////////

    /**
    * @namespace Activate
    * @desc Startup do controlador
    * @memberOf Controllers.AlunoController
    */
    function Activate() {
      if ($state.params.idAluno) {
        self.request.ObjectID = $state.params.idAluno;
        self.edition          = false;

        GetDados();
      }
    }

    /**
    * @namespace Adicionar
    * @desc Adiciona o aluno e envia a senha para o responsavel
    * @memberOf Controllers.AlunoController
    */
    function Adicionar() {
      serverService.Request('CadastrarAluno', self.dadoAdicionar).then(function (resp) {
        $state.go('alunos', { cadastro: 'OK' });
      });
    }

    /**
    * @namespace Atualizar
    * @desc Salva as informacoes editadas e envia ao servidor
    * @memberOf Controllers.AlunoController
    */
    function Atualizar() {
      serverService.Request('AtualizarDadosAluno', self.dado).then(function (resp) {
        toastr.success('Alterações Salvas!');
      });
    }

    /**
    * @namespace Cancelar
    * @desc Cancela as alteracoes feitas pelo usuario
    * @memberOf Controllers.AlunoController
    */
    function Cancelar() {
      self.dado     = self.dadoAux;
      self.edition  = false;
    }

    /**
    * @namespace MountChart
    * @desc Monta os graficos radar para as avaliacoes
		* @param {array} lista - lista com os valores das avaliacoes
    * @memberOf Controllers.AlunoController
    */
    function MountChart(lista) {
      self.graficos = [];

      angular.forEach(lista, function (resultado) {
        var colors    = [];
        var count     = 1; //Usado para escrever o numero da atividade
        var data      = [];
        var descricao = [];
        var labels    = [];//nomes dos marcadores no grafico
        var nome      = resultado.CampoExperiencia;
        var respostas = [];

        angular.forEach(resultado.Itens_Resultado_Avaliacao, function (campos) {
          data.push(campos.Resposta_Value);
          descricao.push(campos.Descricao);
          labels.push('Atividade' + count);

          switch (campos.Resposta_String) {
            case 'Alcançado':
              colors.push('rgb(0, 128, 0)');
              respostas.push('Alcançado');
              break;
            case 'Em processo':
              colors.push('rgb(255, 255, 0)');
              respostas.push('Em processo');
              break;
            case 'Acima do esperado':
              colors.push('rgb(0, 0, 255)');
              respostas.push('Acima do esperado');
              break;
            case 'Não alcançado':
              colors.push('rgb(255, 0, 255)');
              respostas.push('Não alcançado');
              break;
            case 'Não avaliado':
              colors.push('rgb(255, 0, 0)');
              respostas.push('Não avaliado');
              break;

            default:
              break;
          }

          count++;
        });

        self.graficos.push({
          'nome'      : nome,
          'labels'    : labels,
          'respostas' : respostas,
          'data'      : data,
          'dataset'   : {
            'pointBackgroundColor': colors,
            'pointBorderColor'    : colors,
            'backgroundColor'     : 'rgba(35, 159, 219, 0.4)',
            'borderColor'         : 'rgb(35, 159, 219)',
            'pointBorderWidth'    : 10
          },
          'options': {
            tooltips: {
              callbacks: {
                label: function (data) {
                  var retorno = respostas[data.index];
                  return retorno;
                }
              }
            },
            scale: {
              lineArc: true,
              ticks: {
                display       : false,
                beginAtZero   : true,
                min           : 0,
                max           : 100,
                fixedStepSize : 20
              }
            }
          },
          'descricao': descricao
        });
      });
    }

    /**
    * @namespace GetAvaliacaoPedagogica
    * @desc Pega as informacoes das avaliacoes pedagogicas do aluno
    * @memberOf Controllers.AlunoController
    */
    function GetAvaliacaoPedagogica() {
      serverService.Request('RetornarDadosGraficosAvaliacaoPedagogica', self.requestAvaliacao).then(function (resp) {
        self.avaliacoes = resp[0].ResultadoAvaliacoes;
      });
    }

    /**
    * @namespace GetDados
    * @desc Pega as informacoes do aluno no servidor utilizando o id da url
    * @memberOf Controllers.AlunoController
    */
    function GetDados() {
      serverService.Request('RecuperarDadosAlunosEscola', self.request).then(function (resp) {
        self.dado = self.dadoAux = resp[0];

        self.dadoAdicionar.Data_Nascimento    = self.dado.Data_Nascimento;
        self.dadoAdicionar.Email_Responsavel  = self.dado.Email_Responsavel;
        self.dadoAdicionar.Matricula          = self.dado.Matricula;
        self.dadoAdicionar.Nome               = self.dado.Nome;
        self.dadoAdicionar.SenhaAppPai        = self.dado.SenhaAppPai;
        self.dadoAdicionar.Sexo               = self.dado.Sexo;

        self.requestAvaliacao.Id_Aluno = self.request.ObjectID;
        self.requestAvaliacao.Id_Turma = self.dado.Id_Turma;

        GetAvaliacaoPedagogica();
        GetParecerDiscritivo();
      });
    }

    /**
    * @namespace GetParecerDiscritivo
    * @desc Pega as informacoes do parecer discritivo do aluno
    * @memberOf Controllers.AlunoController
    */
    function GetParecerDiscritivo() {
      serverService.Request('RetornarParecerDescritivoPedagogicoAluno', self.requestAvaliacao).then(function (resp) {
        self.parecer = resp;
      });
    }
  }
})();
