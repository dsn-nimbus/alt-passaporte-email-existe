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

          AltPassaporteEmailExisteService.prototype.emailExiste = function(email, comSincronizacao) {
              var _innerThis = this;

              var CHAVE_XPPT = 'x-ppt';
              var VALOR_XPPT = self.xppt;
              var _url = self.URL_BASE_PASSAPORTE + '/passaporte-rest-api/rest/publico/usuarios/emailExiste';

              _url = comSincronizacao ? _url + '/com_sincronizacao' : _url;

              var _obj = {email: email, conta: 0};
              var _config = {
                headers: {

                }
              };

              _config.headers[CHAVE_XPPT] = self.xppt;

              if (ng.isUndefined(email)) {
                return $q.reject(new TypeError('Email não informado para consulta.'));
              }

              return $http.post(_url, _obj, _config)
                          .then(function(r) {
                            dump(r.data)

                            if (comSincronizacao && r && r.data && r.data.deveSincronizar) {
                              return _innerThis.sincronizar(email);
                            }

                            return r;
                          });
          };

          AltPassaporteEmailExisteService.prototype.sincronizar = function(email) {
              var CHAVE_XPPT = 'x-ppt';
              var VALOR_XPPT = self.xppt;
              var _url = self.URL_BASE_PASSAPORTE + '/passaporte-rest-api/rest/publico/usuarios/email/sincronizar';

              var _obj = {email: email, conta: 0};
              var _config = {
                headers: {

                }
              };

              _config.headers[CHAVE_XPPT] = self.xppt;

              if (ng.isUndefined(email)) {
                return $q.reject(new TypeError('Email não informado para sincronização.'));
              }

              return $http.post(_url, _obj, _config)
          };

          return new AltPassaporteEmailExisteService();
      }];
    });
}(window.angular));
