(function () {
  'use strict';

  angular.module('dashboard', [
    'ui.router',  //Controlar URL
    'ngMask',   //Mascara dos inputs
    'ngAnimate', //Usado nas trancições de telas
    'toastr', //Toast( msg popup)
    'ui.bootstrap', //bootstrap
    'chart.js',//grafico
    'ngImgCrop'//image crop
  ]);
})();
