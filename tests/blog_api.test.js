const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const _ = require('lodash')

beforeEach(async () => {
  await Blog.deleteMany({})
})

afterAll(() => {
  mongoose.connection.close()
})

describe('GET /api/blogs request tests', () => {
  test('all blogs are returned', async () => {
    await helper.addMultipleBlogs()
    const response = await api.get('/api/blogs')
    const returnedBlogs = response.body

    expect(returnedBlogs).toHaveLength(helper.listWithManyBlogs.length)
  })

  test('returned blogs have user info in them', async () => {
    const addedUser = await helper.addIndividualUser()
    await helper.addThreeBlogsWithUserId(addedUser._id)

    const response = await api.get('/api/blogs')
    const returnedBlogs = response.body

    const firstBlog = _.first(returnedBlogs)

    expect(firstBlog.user).toBeDefined()
    expect(firstBlog.user.id).toBe(addedUser._id.toString())
  })
})

describe('DELETE /api/blogs request tests', () => {
  test('individual blog can be deleted by user who added it', async () => {
    const userZerocool = await helper.createUserAndEstablishItLoggedIn()

    await helper.addThreeBlogsWithUserId(userZerocool.id)

    const blogsInDbBeforeDelete = await helper.getBlogsInDb()
    const blogToBeDeleted = _.first(blogsInDbBeforeDelete)

    userZerocool.blogs = blogsInDbBeforeDelete.map(blog => blog.id)

    await User.findByIdAndUpdate(userZerocool.id, userZerocool, { new: true })

    const userBeforeDelete = await User.findById(userZerocool.id)

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('Authorization', `bearer ${userZerocool.token}`)
      .expect(204)

    const blogsInDbAfterDelete = await helper.getBlogsInDb()
    const blogsInDbAfterDeleteAsString = JSON.stringify(blogsInDbAfterDelete)

    const userAfterDelete = await User.findById(userZerocool.id)

    expect(blogsInDbAfterDelete).toHaveLength(blogsInDbBeforeDelete.length - 1)
    expect(blogsInDbAfterDeleteAsString).not.toContain(blogToBeDeleted.url)
    expect(blogsInDbAfterDeleteAsString).not.toContain(blogToBeDeleted.title)
    expect(userAfterDelete.blogs).toHaveLength(userBeforeDelete.blogs.length-1)
  })

  test('user who did not add the blog cannot delete it', async () => {
    const userZerocool = await helper.createUserAndEstablishItLoggedIn()
    const userAcidburn = await helper.createAnotherUserAndEstablishItLoggedIn()

    await helper.addThreeBlogsWithUserId(userZerocool.id)

    const blogsInDbBeforeDelete = await helper.getBlogsInDb()
    const blogToBeDeleted = _.first(blogsInDbBeforeDelete)

    userZerocool.blogs = blogsInDbBeforeDelete.map(blog => blog.id)

    await User.findByIdAndUpdate(userZerocool.id, userZerocool, { new: true })

    const userBeforeDelete = await User.findById(userZerocool.id)

    const response = await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('Authorization', `bearer ${userAcidburn.token}`)
      .expect(401)

    const userAfterDelete = await User.findById(userZerocool.id)

    const blogsInDbAfterDelete = await helper.getBlogsInDb()
    const blogsInDbAfterDeleteAsString = JSON.stringify(blogsInDbAfterDelete)

    expect(blogsInDbAfterDelete).toHaveLength(blogsInDbBeforeDelete.length)
    expect(blogsInDbAfterDeleteAsString).toContain(blogToBeDeleted.url)
    expect(blogsInDbAfterDeleteAsString).toContain(blogToBeDeleted.title)
    expect(userAfterDelete.blogs).toHaveLength(userBeforeDelete.blogs.length)
    expect(response.body.error).toContain('blog not created by user')
  })
})

describe('POST /api/blogs request tests', () => {
  test('a new blog is created', async () => {
    const loggedInUser = await helper.createUserAndEstablishItLoggedIn()

    await helper.addMultipleBlogs()

    const blogsInDbBeforePostRequest = await helper.getBlogsInDb()

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loggedInUser.token}`)
      .send(helper.individualBlog)

    const blogsInDbAfterPostRequest = await helper.getBlogsInDb()
    const blogsInDbAfterPostRequestString = JSON.stringify(blogsInDbAfterPostRequest)

    expect(blogsInDbAfterPostRequest).toHaveLength(blogsInDbBeforePostRequest.length+1)
    expect(blogsInDbAfterPostRequestString).toContain(helper.individualBlog.author)
    expect(blogsInDbAfterPostRequestString).toContain(helper.individualBlog.title)
    expect(blogsInDbAfterPostRequestString).toContain(helper.individualBlog.url)
  })

  test('a new blog is not created when user is not logged in and 401 is returned', async () => {
    await helper.addMultipleBlogs()

    const blogsInDbBeforePostRequest = await helper.getBlogsInDb()

    const response = await api
      .post('/api/blogs')
      .send(helper.individualBlog)
      .expect(401)

    const blogsInDbAfterPostRequest = await helper.getBlogsInDb()

    expect(blogsInDbAfterPostRequest).toHaveLength(blogsInDbBeforePostRequest.length)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toContain('token missing or invalid')
  })

  test('if title and url are missing, responds with 401 Invalid request', async() => {
    await helper.addMultipleBlogs()

    const blogObjectWithoutTitleAndUrl = {
      author: helper.individualBlog.author,
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(blogObjectWithoutTitleAndUrl)
      .expect(401)

    const blogsInDbAfterPostRequest = await helper.getBlogsInDb()

    expect(blogsInDbAfterPostRequest).toHaveLength(helper.listWithManyBlogs.length)
  })

  test('created blog has user property', async () => {
    const loggedInUser = await helper.createUserAndEstablishItLoggedIn()

    await helper.addMultipleBlogs()

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loggedInUser.token}`)
      .send(helper.individualBlog)

    const returnedBlog = response.body

    expect(returnedBlog.user).toBeDefined()

  })
})

describe('PUT api/blogs request tests', () => {
  test('likes of a blog can be updated', async () => {
    await helper.addMultipleBlogs()

    const blogsInDbBeforeUpdateRequest = await helper.getBlogsInDb()

    const blogToBeUpdated = await _.first(blogsInDbBeforeUpdateRequest)

    const updatedBlog = { ...blogToBeUpdated, likes: blogToBeUpdated.likes+1 }

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)

    const blogsInDbAfterUpdateRequest = await helper.getBlogsInDb()
    const updatedBlogInDatabase = blogsInDbAfterUpdateRequest.find(blog => blog.id === updatedBlog.id)

    expect(updatedBlogInDatabase.likes).toBe(blogToBeUpdated.likes+1)
  })

  test('author of a blog can be modified', async () => {
    await helper.addMultipleBlogs()

    const blogsInDbBeforeUpdateRequest = await helper.getBlogsInDb()
    const blogToBeUpdated = await _.first(blogsInDbBeforeUpdateRequest)

    const updatedBlog = { ...blogToBeUpdated, author: 'Modified Author' }

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)

    const blogsInDbAfterUpdateRequest = await helper.getBlogsInDb()
    const updatedBlogInDatabase = blogsInDbAfterUpdateRequest.find(blog => blog.id === updatedBlog.id)

    expect(updatedBlogInDatabase.author).not.toBe(blogToBeUpdated.author)
    expect(updatedBlogInDatabase.author).toBe('Modified Author')
  })
})

describe('Blog object tests', () => {
  test('a returned blog object has property id', async () => {
    const blogObject = new Blog(helper.individualBlog)
    await blogObject.save()

    const blogs = await helper.getBlogsInDb()
    const addedBlog = _.first(blogs)

    expect(addedBlog.id).toBeDefined()
  })

  test('when likes property is missing it will be defaulted to 0', async () => {
    const blogObjectWithoutLikes = {
      title: helper.individualBlog.title,
      author: helper.individualBlog.author,
      url: helper.individualBlog.url
    }

    const loggedInUser = await helper.createUserAndEstablishItLoggedIn()

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loggedInUser.token}`)
      .send(blogObjectWithoutLikes)

    const blogsInDbAfterPostRequest = await helper.getBlogsInDb()

    const addedBlog = _.first(blogsInDbAfterPostRequest)

    expect(addedBlog.likes).toBeDefined()
    expect(addedBlog.likes).toBe(0)
  })
})