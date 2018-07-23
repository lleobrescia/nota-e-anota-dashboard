(function () {
  'use strict';

  angular
    .module('dashboard')
    .config(RouteConfig);

  RouteConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

  function RouteConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login',
        title: '- Acessar o Dashboard',
        isLogin: true
      })
      .state('home', {
        url: '/home',
        cache: false,
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home',
        title: '- Nota e Anota',
      })
      .state('alunos', {
        url: '/alunos',
        cache: false,
        params: {
          cadastro: null
        },
        name: 'alunos',
        templateUrl: 'app/alunos/alunos.html',
        controller: 'AlunosController',
        controllerAs: 'alunos',
        title: '- Lista de Alunos',
        isLogin: false
      })
      .state('alunosAdicionar', {
        url: '/alunos/adicionar',
        cache: false,
        templateUrl: 'app/alunos/aluno.html',
        controller: 'AlunoController',
        controllerAs: 'aluno',
        title: '- Adicionar Aluno'
      })
      .state('alunosDetails', {
        url: '/alunos/visualizar/:idAluno',
        cache: false,
        name: 'alunos',
        templateUrl: 'app/alunos/aluno.html',
        controller: 'AlunoController',
        controllerAs: 'aluno',
        title: '- Informações Sobre Aluno'
      })
      .state('professores', {
        url: '/professores',
        cache: false,
        params: {
          cadastro: null
        },
        templateUrl: 'app/professores/professores.html',
        controller: 'ProfessoresController',
        controllerAs: 'profs',
        title: '- Lista de Professores'
      })
      .state('professoresAdicionar', {
        url: '/professores/adicionar',
        cache: false,
        templateUrl: 'app/professores/professor.html',
        controller: 'ProfessorController',
        controllerAs: 'prof',
        title: '- Adicionar Professor'
      })
      .state('professoresDetails', {
        url: '/professores/visualizar/:idProf',
        cache: false,
        templateUrl: 'app/professores/professor.html',
        controller: 'ProfessorController',
        controllerAs: 'prof',
        title: '- Informações Sobre Professor'
      })
      .state('turmas', {
        url: '/turmas',
        cache: false,
        params: {
          cadastro: null
        },
        templateUrl: 'app/turmas/turmas.html',
        controller: 'TurmasController',
        controllerAs: 'turmas',
        title: '- Lista de Turmas'
      })
      .state('turmasAdicionar', {
        url: '/turmas/adicionar',
        cache: false,
        templateUrl: 'app/turmas/turma.html',
        controller: 'TurmaController',
        controllerAs: 'turma',
        title: '- Adicionar Turma'
      })
      .state('turmasDetails', {
        url: '/turmas/visualizar/:idTurma',
        cache: false,
        templateUrl: 'app/turmas/turma.html',
        controller: 'TurmaController',
        controllerAs: 'turma',
        title: '- Informações Sobre Turma'
      })
      .state('comunicacao', {
        url: '/comunicacao',
        cache: false,
        templateUrl: 'app/comunicacao/comunicacao.html',
        controller: 'ComunicacaoController',
        controllerAs: 'comunicacao',
        title: '- Comunicação'
      })
      .state('usuarios', {
        url: '/usuarios',
        cache: false,
        params: {
          cadastro: null
        },
        templateUrl: 'app/usuarios/usuarios.html',
        controller: 'UsuariosController',
        controllerAs: 'usuarios',
        title: '- Usuários'
      })
      .state('usuarioAdicionar', {
        url: '/usuarios/adicionar',
        cache: false,
        templateUrl: 'app/usuarios/usuario.html',
        controller: 'UsuarioController',
        controllerAs: 'usuario',
        title: '- Adicionar Usuário'
      })
      .state('usuarioDetails', {
        url: '/usuarios/visualizar/:idUsuario',
        cache: false,
        templateUrl: 'app/usuarios/usuario.html',
        controller: 'UsuarioController',
        controllerAs: 'usuario',
        title: '- Informações Usuário'
      })
      .state('cardapio', {
        url: '/cardapio',
        cache: false,
        params: {
          cadastro: null
        },
        templateUrl: 'app/cardapio/cardapios.html',
        controller: 'CardapiosController',
        controllerAs: 'cardapios',
        title: '- Cardápio'
      })
      .state('cardapioAdicionar', {
        url: '/cardapio/adicionar',
        cache: false,
        templateUrl: 'app/cardapio/cardapio.html',
        controller: 'CardapioController',
        controllerAs: 'cardapio',
        title: '- Adicionar Cardápio'
      })
      .state('cardapioDetails', {
        url: '/cardapio/visualizar/:idCardapio',
        cache: false,
        templateUrl: 'app/cardapio/cardapio.html',
        controller: 'CardapioController',
        controllerAs: 'cardapio',
        title: '- Informações Cardápio'
      })
      .state('escola', {
        url: '/dados-da-escola',
        cache: false,
        templateUrl: 'app/dados-escola/dados-escola.html',
        controller: 'EscolaController',
        controllerAs: 'escola',
        title: '- Informações da Escola'
      })
      .state('pedagogico', {
        url: '/pedagogico',
        cache: false,
        params: {
          cadastro: null,
          idTurma: null
        },
        templateUrl: 'app/pedagogico/lista.html',
        controller: 'ListaPedagogicoController',
        controllerAs: 'pedagogico',
        title: '- Modulo Pedagógico'
      })
      .state('pedagogicoAdicionar', {
        url: '/pedagogico/adicionar',
        cache: false,
        params: {
          idTurma: null
        },
        templateUrl: 'app/pedagogico/pedagogico.html',
        controller: 'PedagogicoController',
        controllerAs: 'pedagogico',
        title: '- Adicionar Novo Template'
      })
      .state('pedagogicoDetails', {
        url: '/pedagogico/visualizar',
        cache: false,
        params: {
          idTurma: null,
          idAvaliacao: null
        },
        templateUrl: 'app/pedagogico/pedagogico.html',
        controller: 'PedagogicoController',
        controllerAs: 'pedagogico',
        title: '- Informações'
      })
      .state('atividades', {
        url: '/atividades-diarias',
        cache: false,
        params: {
          cadastro: null,
          idTurma: null
        },
        templateUrl: 'app/atividades-diarias/atividades-diarias.html',
        controller: 'AtividadesController',
        controllerAs: 'atividades',
        title: '- Atividades Diárias'
      })
      .state('atividadesAdicionar', {
        url: '/atividades-diarias/adicionar',
        cache: false,
        params: {
          idTurma: null,
          idAtividade: null
        },
        templateUrl: 'app/atividades-diarias/atividade-diaria.html',
        controller: 'AtividadeController',
        controllerAs: 'atividade',
        title: '- Adicionar Cardápio'
      })
      .state('atividadesDetails', {
        url: '/atividades-diarias/visualizar',
        cache: false,
        params: {
          idTurma: null,
          idAtividade: null
        },
        templateUrl: 'app/atividades-diarias/atividade-diaria.html',
        controller: 'AtividadeController',
        controllerAs: 'atividade',
        title: '- Informações Cardápio'
      })
      .state('calendario', {
        url: '/calendario',
        cache: false,
        params: {
          cadastro: null
        },
        templateUrl: 'app/calendario/calendario.html',
        controller: 'CalendarioController',
        controllerAs: 'calendario',
        title: '- Calendário'
      })
      .state('calendarioAdicionar', {
        url: '/calendario/adicionar',
        cache: false,
        templateUrl: 'app/calendario/item.html',
        controller: 'ItemCalendarioController',
        controllerAs: 'item',
        title: '- Adicionar Item ao Calendário'
      })
      .state('calendarioDetails', {
        url: '/calendario/visualizar/:idCalendario',
        cache: false,
        templateUrl: 'app/calendario/item.html',
        controller: 'ItemCalendarioController',
        controllerAs: 'item',
        title: '- Informações Calendário'
      });
  }
})();
