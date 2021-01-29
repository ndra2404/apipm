const request = require('supertest')
const app = require('../app')

describe('Master company', () => {
  it('Should get a list of companies', async done => {
    const res = await request(app).get('/company')
    expect(res.statusCode).toEqual(200)
    done()
  })
})

describe('Master company detail', () => {
  it('Should get details of a company', async done => {
    const res = await request(app).get('/company/detail/6510')
    expect(res.statusCode).toEqual(200)
    done()
  })
})

describe('Master leave', () => {
  it('Should get list of leave master from a company', async done => {
    const res = await request(app).get('/leave?company_code=6510')
    expect(res.statusCode).toEqual(200)
    done()
  })
})
