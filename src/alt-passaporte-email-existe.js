;(function(ng) {
  "use strict";

  ng.module('alt.passaporte-email-existe', [])
    .provider('AltPassaporteEmailExisteService', function() {
      var self = this;

      self.xppt = '';
      self.URL_BASE_PASSAPORTE = '';

      self.$get = ['$http', '$q', function($http, $q) {
          var AltPassaporteEmailExisteService = function() {

          };

          AltPassaporteEmailExisteService.prototype.emailExiste = function(email) {
              var CHAVE_XPPT = 'x-ppt';
              var VALOR_XPPT = self.xppt;
              var URL = self.URL_BASE_PASSAPORTE + '/passaporte-rest-api/rest/publico/usuarios/emailExiste';
              var _obj = {email: email, conta: 0};
              var _config = {
                headers: {

                }
              };

              _config.headers[CHAVE_XPPT] = self.xppt;

              if (ng.isUndefined(email)) {
                return $q.reject(new TypeError('Email não informado para consulta.'));
              }

              return $http.post(URL, _obj, _config);
          };

          return new AltPassaporteEmailExisteService();
      }];
    });
}(window.angular));
