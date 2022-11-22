process.env.NODE_ENV = 'test';
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);
describe('/POST login ', () => {
  it('it should return Token',  (done) => {
    let User = {

      email: 'mohamedouf501@gmail.com',
      password: "123456",

    }
    chai.request('http://localhost:3000')
      .post('/user/login')
      .send(User)
      .end((err, res) => {
        done();
      }).catch(function (err) {
        throw err;
      });
    ;
  });
})