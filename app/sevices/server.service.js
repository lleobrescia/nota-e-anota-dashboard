/**
* Server Service
* @namespace Services
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('serverService', serverService);

  serverService.$inject = ['$q', '$http', 'RequestAsFormPost'];
  /**
  * @namespace serverService
  * @desc Faz a coneccao com o API Service
  * @memberOf Services
  */
  function serverService($q, $http, RequestAsFormPost) {
    var token = '839awwf8a0acf0ffdcbd3b10cd48a719898';
    var appid = '839awwf8a0acf0ffdcbd3b10cd48a719898';

    var service = {
      Request: Request
    };

    return service;

    ////////////////

    /**
    * @namespace Request
    * @desc Envia o endpoint e o json da requisicao para a funcao SendData
    * @param {String} endpoint - endpoint do servico que deseja acessar
    * @param {Json} json - request Json body
    * @return {Promise}
    * @memberOf Services.serverService
    */
    function Request(endpoint, json) {
      var call;
      var deferred = $q.defer();
      var data = {
        'uri': 'http://52.23.250.176/webservice/WebServiceGDE.svc/' + endpoint,
        'json': angular.toJson(json),
        'appid': appid,
        'token': token
      };
      call = SendData(data);

      call.success(function (data) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject(arguments);
      });

      return deferred.promise;
    }

    /**
    * @namespace SendData
    * @desc Envia (ajax) um post ao API Service
    * @param {Object} Data - data para ser enviado pelo ajax
    * @return {String|JSON} Retorna um string em formato json
    * @memberOf Services.serverService
    */
    function SendData(Data) {
      var requisicao = $http({
        method: 'POST',
        url: 'http://52.23.250.176/webservice/web/service_request.aspx',
        transformRequest: RequestAsFormPost.TransformRequest,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        // withCredentials: true,
        data: Data
      });

      return requisicao;
    }
  }
})();
