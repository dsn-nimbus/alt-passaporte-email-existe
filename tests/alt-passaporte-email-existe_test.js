"use strict";

describe('my awesome app', function() {
  var _rootScope, _httpBackend, _q, AltPassaporteEmailExisteService;
  var URL_BASE = '/abc/123';
  var URL = URL_BASE + '/passaporte-rest-api/rest/publico/usuarios/emailExiste';
  var URL_SINCRONIZAR = URL_BASE + '/passaporte-rest-api/rest/publico/usuarios/email/sincronizar';
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
    describe('sem sincronizacao', function() {
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
      });

      it('deve verificar se o email existe - servidor retorna ok - 200', function() {
        var _email = 'a@b.com';
        var _objChamada = {email: _email, conta: 0};

        spyOn(AltPassaporteEmailExisteService, 'sincronizar').and.callFake(angular.noop);

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

        expect(AltPassaporteEmailExisteService.sincronizar).not.toHaveBeenCalled();
      });
    });

    describe('com_sincronizacao', function() {
      var _urlSincronizacao = URL + '/com_sincronizacao';
      var _comSincronizacao = true;

      it('deve retornar erro, email não foi informado', function() {
        var _email = undefined;

        AltPassaporteEmailExisteService
        .emailExiste(_email, _comSincronizacao)
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

        _httpBackend.expectPOST(_urlSincronizacao).respond(400, {});

        AltPassaporteEmailExisteService
        .emailExiste(_email, _comSincronizacao)
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

        _httpBackend.expectPOST(_urlSincronizacao, _objChamada, function(headers) {
          return headers['x-ppt'] === XPPT;
        }).respond(400, {});

        AltPassaporteEmailExisteService
        .emailExiste(_email, _comSincronizacao)
        .then(function() {
          expect(true).toBe(false);
        })
        .catch(function(erro) {
          expect(erro).toBeDefined();
        });

        _httpBackend.flush();
      })

      it('deve verificar se o email existe - servidor retorna ok - 200 - não deve chamar o sincronizar', function() {
        var _email = 'a@b.com';
        var _objChamada = {email: _email, conta: 0};
        var _respostaEmailExiste = {
          deveSincronizar: false
        }

        spyOn(AltPassaporteEmailExisteService, 'sincronizar').and.callFake(function() {
          return _q.when({});
        })

        _httpBackend.expectPOST(_urlSincronizacao, _objChamada, function(headers) {
          return headers['x-ppt'] === XPPT;
        }).respond(200, _respostaEmailExiste);

        AltPassaporteEmailExisteService
        .emailExiste(_email, _comSincronizacao)
        .then(function() {
          expect(true).toBe(true);
        })
        .catch(function(erro) {
          expect(true).toBe(false);
        });

        _httpBackend.flush();

        expect(AltPassaporteEmailExisteService.sincronizar).not.toHaveBeenCalled();
      })

      it('deve verificar se o email existe - servidor retorna ok - 200 - não deve chamar o sincronizar', function() {
        var _email = 'a@b.com';
        var _objChamada = {email: _email, conta: 0};
        var _respostaEmailExiste = {
          deveSincronizar: true
        }

        spyOn(AltPassaporteEmailExisteService, 'sincronizar').and.callFake(function() {
          return _q.when({});
        })

        _httpBackend.expectPOST(_urlSincronizacao, _objChamada, function(headers) {
          return headers['x-ppt'] === XPPT;
        }).respond(200, _respostaEmailExiste);

        AltPassaporteEmailExisteService
        .emailExiste(_email, _comSincronizacao)
        .then(function() {
          expect(true).toBe(true);
        })
        .catch(function(erro) {
          expect(true).toBe(false);
        });

        _httpBackend.flush();

        expect(AltPassaporteEmailExisteService.sincronizar).not.toHaveBeenCalled();
      })
    });
  })

  describe('sincronizar', function() {
    it('deve retornar erro, email não foi informado', function() {
      var _email = undefined;

      AltPassaporteEmailExisteService
      .sincronizar(_email)
      .then(function() {
        expect(true).toBe(false);
      })
      .catch(function(erro) {
        expect(erro).toBeDefined();
        expect(erro instanceof TypeError).toBeDefined();
        expect(erro.message).toEqual('Email não informado para sincronização.');
      });

      _rootScope.$digest();
    });

    it('deve tentar sincronizar - servidor retorna erro - 400', function() {
      var _email = 'a@b.com';

      _httpBackend.expectPOST(URL_SINCRONIZAR).respond(400, {});

      AltPassaporteEmailExisteService
      .sincronizar(_email)
      .then(function() {
        expect(true).toBe(false);
      })
      .catch(function(erro) {
        expect(erro).toBeDefined();
      });

      _httpBackend.flush();
    })

    it('deve tentar sincronizar - servidor retorna erro - 400', function() {
      var _email = 'a@b.com';
      var _objChamada = {email: _email, conta: 0};

      _httpBackend.expectPOST(URL_SINCRONIZAR, _objChamada, function(headers) {
        return headers['x-ppt'] === XPPT;
      }).respond(400, {});

      AltPassaporteEmailExisteService
      .sincronizar(_email)
      .then(function() {
        expect(true).toBe(false);
      })
      .catch(function(erro) {
        expect(erro).toBeDefined();
      });

      _httpBackend.flush();
    })

    it('deve sincronizar corretamente - servidor retorna ok - 200', function() {
      var _email = 'a@b.com';
      var _objChamada = {email: _email, conta: 0};

      _httpBackend.expectPOST(URL_SINCRONIZAR, _objChamada, function(headers) {
        return headers['x-ppt'] === XPPT;
      }).respond(200);

      AltPassaporteEmailExisteService
      .sincronizar(_email)
      .then(function() {
        expect(true).toBe(true);
      })
      .catch(function(erro) {
        expect(true).toBe(false);
      });

      _httpBackend.flush();
    })

    it('deve sincronizar corretamente, parâmetro de query string é um objeto vazio - servidor retorna ok - 200', function() {
      var _email = 'a@b.com';
      var _objChamada = {email: _email, conta: 0};
      var _queryString = {};

      _httpBackend.expectPOST(URL_SINCRONIZAR, _objChamada, function(headers) {
        return headers['x-ppt'] === XPPT;
      }).respond(200);

      AltPassaporteEmailExisteService
      .sincronizar(_email, _queryString)
      .then(function() {
        expect(true).toBe(true);
      })
      .catch(function(erro) {
        expect(true).toBe(false);
      });

      _httpBackend.flush();
    })

    it('deve sincronizar corretamente, parâmetro de query string tem continue - servidor retorna ok - 200', function() {
      var _email = 'a@b.com';
      var _objChamada = {email: _email, conta: 0};
      var _queryString = {continue: 'http://123.com'};

      _httpBackend.expectPOST(URL_SINCRONIZAR + "?continue="+_queryString.continue, _objChamada, function(headers) {
        return headers['x-ppt'] === XPPT;
      }).respond(200);

      AltPassaporteEmailExisteService
      .sincronizar(_email, _queryString)
      .then(function() {
        expect(true).toBe(true);
      })
      .catch(function(erro) {
        expect(true).toBe(false);
      });

      _httpBackend.flush();
    })

    it('deve sincronizar corretamente, parâmetro de query string tem continue e idProduto - servidor retorna ok - 200', function() {
      var _email = 'a@b.com';
      var _objChamada = {email: _email, conta: 0};
      var _queryString = {continue: 'http://123.com', idProduto: 123};

      _httpBackend.expectPOST(URL_SINCRONIZAR + "?continue="+_queryString.continue+"&idProduto="+_queryString.idProduto, _objChamada, function(headers) {
        return headers['x-ppt'] === XPPT;
      }).respond(200);

      AltPassaporteEmailExisteService
      .sincronizar(_email, _queryString)
      .then(function() {
        expect(true).toBe(true);
      })
      .catch(function(erro) {
        expect(true).toBe(false);
      });

      _httpBackend.flush();
    })

    it('deve sincronizar corretamente, parâmetro de query string tem informações aleatórias - servidor retorna ok - 200', function() {
      var _email = 'a@b.com';
      var _objChamada = {email: _email, conta: 0};
      var _queryString = {a: 1, b: true, xyz: 999};

      _httpBackend.expectPOST(URL_SINCRONIZAR + "?a=1&b=true&xyz=999", _objChamada, function(headers) {
        return headers['x-ppt'] === XPPT;
      }).respond(200);

      AltPassaporteEmailExisteService
      .sincronizar(_email, _queryString)
      .then(function() {
        expect(true).toBe(true);
      })
      .catch(function(erro) {
        expect(true).toBe(false);
      });

      _httpBackend.flush();
    })
  });
});
