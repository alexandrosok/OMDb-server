let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);


describe('/POST /movies/search', () => {
    it('it should search a movie', (done) => {
        let Payload = {
            term: "Game of thrones"
        };
        chai.request(server)
            .post('/movies/search')
            .send(Payload)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property("status");
                res.body.should.have.property("message");
                res.body.should.have.property("movie");
                done();
            });
    });
});
