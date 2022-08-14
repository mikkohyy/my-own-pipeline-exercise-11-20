const User = require('../models/user')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

afterAll(() => {
  mongoose.connection.close()
})

describe('login tests', () => {
  test('user is logged in when right password is given', async() => {
    const addedUser = await helper.addIndividualUser()
    const userPassword = addedUser.username.split('').reverse().join('')

    const response = await api
      .post('/api/login')
      .send({ username: addedUser.username, password: userPassword })
      .expect(200)

    expect(response.body).toHaveProperty('token')
    expect(response.body.username).toBe('zerocool')
    expect(response.body.name).toBe('Dade Murphy')
  })

  test('existing user is not logged in when wrong password is given', async() => {
    const addedUser = await helper.addIndividualUser()

    const response = await api
      .post('/api/login')
      .send({ username: addedUser.username, password: 'itrytohack' })
      .expect(401)

    expect(response.body).not.toHaveProperty('token')
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toContain('invalid username or password')
  })

  test('user is not logged if user does not exist', async() => {
    const response = await api
      .post('/api/login')
      .send({ username: 'neuromancer', password: 'itrytohack' })
      .expect(401)

    expect(response.body).not.toHaveProperty('token')
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toContain('invalid username or password')
  })
})