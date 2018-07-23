(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('SortByService', SortByService);

  function SortByService() {
    this.propertyName = '';
    this.reverse = false;

    this.SortBy = SortBy;

    ////////////////

    function SortBy(name) {
      this.reverse = (this.propertyName === name) ? !this.reverse : false;
      this.propertyName = name;
    }
  }
})();
