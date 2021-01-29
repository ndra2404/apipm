const request = require('supertest')
const app = require('../app')
describe('Endpoint Authentication', () => {
  it('Should logged in user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: '41795',
        password: '12345678',
        domain: 'mahadasha',
        company: '6510',
      })
    expect(res.statusCode).toEqual(200)
  })
})
