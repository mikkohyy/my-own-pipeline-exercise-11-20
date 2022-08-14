const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const _ = require('lodash')

beforeEach(async () => {
  await User.deleteMany({})
})

afterAll(() => {
  mongoose.connection.close()
})

describe('GET /api/users request tests', () => {
  test('user has list of their blogs', async() => {
    const addedUser = await helper.addIndividualUser()
    const addedBlogs = await helper.addThreeBlogsWithUserId(addedUser._id)

    const blogIds = addedBlogs.map(blog => blog.id)

    addedUser.blogs = blogIds

    await addedUser.save()

    const response = await api.get('/api/users')
    const returnedUsers = response.body
    const firstUser = _.first(returnedUsers)

    const blogsInDb = await helper.getBlogsInDb()

    expect(firstUser.blogs).toBeDefined()
    expect(firstUser.blogs).toHaveLength(blogsInDb.length)
  })
})

describe('POST /api/users request tests', () => {
  test('a new user is created', async() => {
    const usersInDbBeforePostRequest = await helper.getUsersInDb()

    await api
      .post('/api/users')
      .send(helper.individualUser)
      .expect(201)

    const usersInDbAfterPostRequest = await helper.getUsersInDb()
    const usersInDbAfterPostRequestString = JSON.stringify(usersInDbAfterPostRequest)

    expect(usersInDbAfterPostRequest).toHaveLength(usersInDbBeforePostRequest.length+1)
    expect(usersInDbAfterPostRequestString).toContain(helper.individualUser.username)
    expect(usersInDbAfterPostRequestString).toContain(helper.individualUser.name)
    expect(usersInDbAfterPostRequestString).not.toContain(helper.individualUser.password)

  })

  test('when no username is given respond with 400 and does not create new user', async() => {
    const usersInDbBeforePostRequest = await helper.getUsersInDb()

    const userWithoutUsername = {
      name: helper.individualUser.name,
      password: helper.individualUser.password
    }

    const response = await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)

    const usersInDbAfterPostRequest = await helper.getUsersInDb()
    const usersInDbAfterPostRequestString = JSON.stringify(usersInDbAfterPostRequest)

    expect(usersInDbAfterPostRequest).toHaveLength(usersInDbBeforePostRequest.length)
    expect(usersInDbAfterPostRequestString).not.toContain(userWithoutUsername.name)
    expect(response.body.error).toContain('validation failed')
  })

  test('when username is under 3 chars respond with 400 and does not create new user', async() => {
    const usersInDbBeforePostRequest = await helper.getUsersInDb()

    const userWithTooShortUsername = {
      name: helper.individualUser.name,
      username: 'zc',
      password: helper.individualUser.password
    }

    const response = await api
      .post('/api/users')
      .send(userWithTooShortUsername)
      .expect(400)

    console.log(response.body.error)

    const usersInDbAfterPostRequest = await helper.getUsersInDb()
    const usersInDbAfterPostRequestString = JSON.stringify(usersInDbAfterPostRequest)

    expect(usersInDbAfterPostRequest).toHaveLength(usersInDbBeforePostRequest.length)
    expect(usersInDbAfterPostRequestString).not.toContain(userWithTooShortUsername.name)
    expect(response.body.error).toContain('validation failed')
    expect(response.body.error).toContain('shorter than the minimum allowed length')
  })

  test('when username is 3 chars respond with 201 and create new user', async() => {
    const usersInDbBeforePostRequest = await helper.getUsersInDb()

    const userWithUsernameOfThreeChars = {
      name: helper.individualUser.name,
      username: 'zco',
      password: helper.individualUser.password
    }

    await api
      .post('/api/users')
      .send(userWithUsernameOfThreeChars)
      .expect(201)

    const usersInDbAfterPostRequest = await helper.getUsersInDb()
    const usersInDbAfterPostRequestString = JSON.stringify(usersInDbAfterPostRequest)

    expect(usersInDbAfterPostRequest).toHaveLength(usersInDbBeforePostRequest.length+1)
    expect(usersInDbAfterPostRequestString).toContain(userWithUsernameOfThreeChars.name)
    expect(usersInDbAfterPostRequestString).toContain(userWithUsernameOfThreeChars.username)
  })

  test('when username already exists, does not create new user', async () => {
    const user = new User({
      username: helper.individualUser.username,
      name: 'Second Zerocool',
      passwordHash: 'shh'
    })

    await user.save()

    const usersInDbBeforePostRequest = await helper.getUsersInDb()

    const response = await api
      .post('/api/users')
      .send(helper.individualUser)
      .expect(400)

    const usersInDbAfterPostRequest = await helper.getUsersInDb()
    const usersInDbAfterPostRequestString = JSON.stringify(usersInDbAfterPostRequest)

    expect(usersInDbAfterPostRequest).toHaveLength(usersInDbBeforePostRequest.length)
    expect(usersInDbAfterPostRequestString).not.toContain(helper.individualUser.name)
    expect(response.body.error).toContain('to be unique')
  })

  test('when no password is given respond with 400', async() => {
    const usersInDbBeforePostRequest = await helper.getUsersInDb()

    const userWithoutPassword = {
      username: helper.individualUser.username,
      name: helper.individualUser.name,
    }

    const response = await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400)

    const usersInDbAfterPostRequest = await helper.getUsersInDb()
    const usersInDbAfterPostRequestString = JSON.stringify(usersInDbAfterPostRequest)

    expect(usersInDbAfterPostRequest).toHaveLength(usersInDbBeforePostRequest.length)
    expect(usersInDbAfterPostRequestString).not.toContain(userWithoutPassword.name)
    expect(response.body.error).toContain('password is missing')
  })

  test('when given password under 3 characters respond with 400', async() => {
    const usersInDbBeforePostRequest = await helper.getUsersInDb()

    const userWithTooShortPassword = {
      username: helper.individualUser.username,
      name: helper.individualUser.name,
      password: 'cz'
    }

    const response = await api
      .post('/api/users')
      .send(userWithTooShortPassword)
      .expect(400)

    const usersInDbAfterPostRequest = await helper.getUsersInDb()
    const usersInDbAfterPostRequestString = JSON.stringify(usersInDbAfterPostRequest)

    expect(usersInDbAfterPostRequest).toHaveLength(usersInDbBeforePostRequest.length)
    expect(usersInDbAfterPostRequestString).not.toContain(userWithTooShortPassword.name)
    expect(response.body.error).toContain('password is too short')
  })

  test('when given password 3 characters long respond with 201', async() => {
    const usersInDbBeforePostRequest = await helper.getUsersInDb()

    const userWithTooShortPassword = {
      username: helper.individualUser.username,
      name: helper.individualUser.name,
      password: 'zec'
    }

    await api
      .post('/api/users')
      .send(userWithTooShortPassword)
      .expect(201)

    const usersInDbAfterPostRequest = await helper.getUsersInDb()
    const usersInDbAfterPostRequestString = JSON.stringify(usersInDbAfterPostRequest)

    expect(usersInDbAfterPostRequest).toHaveLength(usersInDbBeforePostRequest.length+1)
    expect(usersInDbAfterPostRequestString).toContain(userWithTooShortPassword.name)
  })
})