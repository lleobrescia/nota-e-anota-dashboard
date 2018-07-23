(function () {
  'use strict';

  angular.module('dashboard')
    .run(Run);

  Run.$inject = ['$rootScope', '$state', 'session'];

  function Run($rootScope, $state, session) {
    $rootScope.$on('$stateChangeSuccess', ChangeSuccess);
    $rootScope.$on('$stateChangeStart', ChangeStart);

    function ChangeStart(event, toState, toParams, fromState, fromParams) {
      var userAuthenticated = false;
      session.RestoreState();
      console.log(toState.isLogin);

      if (session.user.id) {
        userAuthenticated = true;
      }

      if (!userAuthenticated && !toState.isLogin) {
        event.preventDefault();
        $state.go('login');
      }

      if (toState.name === 'login') {
        $rootScope.loginClass = 'pageLogin';
        $rootScope.isLogin = true;

        if (userAuthenticated) {
          event.preventDefault();
          $rootScope.loginClass = '';
          $state.go('alunos');
        }
      } else {
        $rootScope.loginClass = '';
        $rootScope.isLogin = false;
      }

    }

    function ChangeSuccess() {
      $rootScope.$broadcast('restorestate');

      //Change page title, based on Route information
      $rootScope.title = $state.current.title;
    }
  }
})();
