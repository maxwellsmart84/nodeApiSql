import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/serve';

process.env.NODE_ENV = 'test';

const should = chai.should();
chai.use(chaiHttp);

describe('/ GET', () => {
  it('it should return a 200', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('server', 'online');
        done();
        process.exit();
      });
  });
});
