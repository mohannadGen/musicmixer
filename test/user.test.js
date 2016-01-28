var expect = require('chai').expect;
var should = require('chai').should;
var supertest = require('supertest');
var api = supertest('http://localhost:8080');

describe('User Model | Login Page', function(){
    it('should return a 200 response', function(done){
        api.get('/')
        .expect(200, done);
    });
    it('should return text/html', function(done){
        api.get('/')
        .contains('Login');
    });
});
