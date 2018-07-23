(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('TurmaController', TurmaController);

  TurmaController.$inject = ['serverService', 'toastr', '$state', 'ListManagerService', 'session'];
  function TurmaController(serverService, toastr, $state, ListManagerService, session) {
    var idEscola = session.user.idEscola;
    var self = this;

    self.alunos = [];
    self.alunosSelecionados = [];
    self.dado = {
      'Ano': '',
      'Id_Escola': idEscola,
      'Nome': '',
      'Serie': '',
      'Sigla': ''
    };
    self.dadoAux = [];
    self.edition = false;
    self.professores = [];
    self.profSelecionado = null;
    self.request = {
      'ObjectID': '',
      'Id_Escola': idEscola
    };

    self.AdicionarTurma = AdicionarTurma;
    self.Atualizar = Atualizar;
    self.CancelarEdicao = CancelarEdicao;
    self.FilterAlunos = FilterAlunos;
    self.ListManagerService = ListManagerService; //Servico usado na view

    Activate();

    ////////////////

    function Activate() {
      if ($state.params.idTurma) {
        self.request.ObjectID = $state.params.idTurma;
        GetTurma();
      }
      GetAlunos();
      GetProfessores();
    }

    function AdicionarAlunosATurma() {
      var request = {
        'Ano': self.dado.Ano,
        'Id_Aluno': '',
        'Id_Escola': idEscola,
        'Id_Turma': self.request.ObjectID
      };
      console.log(self.alunosSelecionados);
      angular.forEach(self.alunosSelecionados, function (item) {
        if (!item.disabled) {
          request.Id_Aluno = item.Id;

          serverService.Request('AdicionarAlunoTurma', request).then(function (resp) {
            item.disabled = true;
          });
        }
      });
    }

    function AdicionarProfATurma() {
      var request = {
        'Ano': self.dado.Ano,
        'Id_Escola': idEscola,
        'Id_Professor': self.profSelecionado,
        'Id_Turma': self.request.ObjectID
      };
      serverService.Request('AssociarProfessorTurma', request).then(function (resp) {
        AdicionarAlunosATurma();
        $state.go('turmas', { cadastro: 'OK' });
      });
    }

    function AdicionarTurma() {
      serverService.Request('CadastrarTurma', self.dado).then(function (resp) {
        self.request.ObjectID = resp.Id;
        AdicionarProfATurma();
      });
    }

    function Atualizar() {
      var request = {
        'Ano': self.dado.Ano,
        'Id_Escola': idEscola,
        'Nome': self.dado.Nome,
        'Serie': self.dado.Serie,
        'Sigla': self.dado.Sigla,
        'Id': self.dado.Id
      };
      serverService.Request('AtualizarDadosTurma', request).then(function (resp) {

        if (self.alunosSelecionados.length > 0) {
          AdicionarAlunosATurma();
        }

        self.edition = false;
        toastr.success('Turma Atualizada');
      });
    }

    function CancelarEdicao() {
      self.dado = self.dadoAux;
    }

    function FilterAlunos(aluno) {
      return self.alunosSelecionados.indexOf(aluno) === -1;
    }

    function GetTurma() {
      serverService.Request('RecuperarDadosTurmasEscola', self.request).then(function (resp) {
        self.dado = self.dadoAux = resp[0];
        self.profSelecionado = self.dado.Id_Professor;

        console.log(self.dado);
      });
    }

    function GetAlunos() {
      serverService.Request('RecuperarDadosAlunosEscola', { 'ObjectID': '', 'Id_Escola': idEscola }).then(function (resp) {
        angular.forEach(resp, function (item) {
          if (!item.Id_Turma) {
            item.disabled = false;
            self.alunos.push(item);
          } else if (item.Id_Turma === self.request.ObjectID) {
            item.disabled = true;
            self.alunosSelecionados.push(item);
          }

        });
      });
    }

    function GetProfessores() {
      serverService.Request('RecuperarDadosProfessoresEscola', { 'ObjectID': '', 'Id_Escola': idEscola }).then(function (resp) {
        self.professores = resp;

        console.log(resp);
      });
    }
  }
})();
