var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var config = require('../config');

chai.use(chaiHttp);

//An example to get things going...

// describe('Blobs', function() {
//   it('should list ALL blobs on /blobs GET');
//   it('should list a SINGLE blob on /blob/<id> GET');
//   it('should add a SINGLE blob on /blobs POST');
//   it('should update a SINGLE blob on /blob/<id> PUT');
//   it('should delete a SINGLE blob on /blob/<id> DELETE');
// });


describe('Bender', function () {
    it('should reply back GET', function (done) {
        chai.request(server)
            .get('/test')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                expect(res.body.data).to.be.a('string');
                expect(res.body.data).to.contain('Bender');
                done();
            });
    });
    it('should thank for giving liquor on /test/liquor POST', function (done) {
        chai.request(server)
            .post('/test/liquor')
            .auth(config.authentication.basic.username, config.authentication.basic.password)
            .send({ 'firstName': 'Bud', 'lastName': 'Buzz' })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                expect(res.body.data).to.be.a('string');
                expect(res.body.data).to.contain('Thank you');
                done();
            });
    });
    //Status Checks
    it('should get a 500 on /test/500 GET', function (done) {
        chai.request(server)
            .get('/test/500')
            .end(function (err, res) {
                res.should.have.status(500);
                done();
            });
    });
    it('should get a 401 on /test/401 GET', function (done) {
        chai.request(server)
            .get('/test/401')
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
});