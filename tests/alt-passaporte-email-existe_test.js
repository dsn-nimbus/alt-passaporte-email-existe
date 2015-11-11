"use strict";

describe('my awesome app', function() {
  var _rootScope, _httpBackend, _q, AltPassaporteEmailExisteService;
  var URL_BASE = '/abc/123';
  var URL = URL_BASE + '/passaporte-rest-api/rest/publico/usuarios/emailExiste';
  var XPPT = '123456789';

  beforeEach(module('alt.passaporte-email-existe', function(AltPassaporteEmailExisteServiceProvider) {
    AltPassaporteEmailExisteServiceProvider.xppt = XPPT;
    AltPassaporteEmailExisteServiceProvider.URL_BASE_PASSAPORTE = URL_BASE;
  }));

  beforeEach(inject(function($injector) {
    _rootScope = $injector.get('$rootScope');
    _httpBackend = $injector.get('$httpBackend');
    _q = $injector.get('$q');

    AltPassaporteEmailExisteService = $injector.get('AltPassaporteEmailExisteService');
  }));

  describe('criação', function() {
    it('deve ter retornar o service corretamente', function() {
      expect(typeof AltPassaporteEmailExisteService).toBe('object');
    })
  })

  describe('emailExiste', function() {
    it('deve retornar erro, email não foi informado', function() {
      var _email = undefined;

      AltPassaporteEmailExisteService
        .emailExiste(_email)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
          expect(erro instanceof TypeError).toBeDefined();
          expect(erro.message).toEqual('Email não informado para consulta.');
        });

      _rootScope.$digest();
    });

    it('deve verificar se o email existe - servidor retorna erro - 400', function() {
      var _email = 'a@b.com';

      _httpBackend.expectPOST(URL).respond(400, {});

      AltPassaporteEmailExisteService
        .emailExiste(_email)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
        });

      _httpBackend.flush();
    })

    it('deve verificar se o email existe - servidor retorna erro - 400', function() {
      var _email = 'a@b.com';
      var _objChamada = {email: _email, conta: 0};

      _httpBackend.expectPOST(URL, _objChamada, function(headers) {
          return headers['x-ppt'] === XPPT;
      }).respond(400, {});

      AltPassaporteEmailExisteService
        .emailExiste(_email)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
        });

      _httpBackend.flush();
    })

    it('deve verificar se o email existe - servidor retorna ok - 200', function() {
      var _email = 'a@b.com';
      var _objChamada = {email: _email, conta: 0};

      _httpBackend.expectPOST(URL, _objChamada, function(headers) {
          return headers['x-ppt'] === XPPT;
      }).respond(200);

      AltPassaporteEmailExisteService
        .emailExiste(_email)
        .then(function() {
          expect(true).toBe(true);
        })
        .catch(function(erro) {
          expect(true).toBe(false);
        });

      _httpBackend.flush();
    })
  })
});
