const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const addThreeBlogsWithUserId = async (userId) => {
  await Blog.deleteMany({})

  const blogsWithUserId = [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: userId
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      user: userId
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user: userId
    }
  ]

  const blogObjects = blogsWithUserId.map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  const returnedBlogs = await Promise.all(promiseArray)

  return returnedBlogs
}

const addMultipleBlogs = async () => {
  const blogObjects = listWithManyBlogs.map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}

const addIndividualUser = async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('loocorez', saltRounds)

  const newUser = {
    username: 'zerocool',
    name: 'Dade Murphy',
    passwordHash: passwordHash,
    blogs: []
  }

  const userObject = new User(newUser)
  const returnedUser = await userObject.save()

  return returnedUser
}

const addAcidburnUser = async () => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('nrubdica', saltRounds)

  const newUser = {
    username: 'acidburn',
    name: 'Kate Libby',
    passwordHash: passwordHash,
    blogs: []
  }

  const userObject = new User(newUser)
  const returnedUser = await userObject.save()

  return returnedUser
}

const addMultipleUsers = async() => {
  await User.deleteMany({})

  const userObjects = listWithManyUsers.map(user => new User(user))

  const promiseArray = userObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}

const createUserAndEstablishItLoggedIn = async() => {
  await User.deleteMany({})

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('loocorez', saltRounds)

  const newUser = {
    username: 'zerocool',
    name: 'Dade Murphy',
    passwordHash: passwordHash,
    blogs: []
  }

  const userObject = new User(newUser)
  const returnedUser = await userObject.save()

  const userForToken = {
    username: returnedUser.username,
    id: returnedUser._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  const loggedInUser = { ...userForToken, token }

  return loggedInUser
}

const createAnotherUserAndEstablishItLoggedIn = async() => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash('nrubdica', saltRounds)

  const newUser = {
    username: 'acidburn',
    name: 'Kate Libby',
    passwordHash: passwordHash,
    blogs: []
  }

  const userObject = new User(newUser)
  const returnedUser = await userObject.save()

  const userForToken = {
    username: returnedUser.username,
    id: returnedUser._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  const loggedInUser = { ...userForToken, token }

  return loggedInUser
}

const getBlogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getUsersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const individualBlog = {
  title: 'Rules for Being a Green Software Engineer',
  author: 'Hamid Shojaee',
  url: 'https://www.axosoft.com/dev-blog/rules-for-being-a-green-software-engineer',
  likes: 2
}

const individualUser = {
  username: 'zerocool',
  name: 'Dade Murphy',
  password: 'loocorez'
}

const listWithManyBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'Better tooling wont fix your API',
    author: 'Swizec Teller',
    url: 'https://swizec.com/blog/better-tooling-wont-fix-your-api/',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'How GraphQL blows REST out of water',
    author: 'Swizec Teller',
    url: 'https://swizec.com/blog/how-graphql-blows-rest-out-of-the-water/',
    likes: 3
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'The quickest way to fail a tech interview',
    author: 'Swizec Teller',
    url: 'https://swizec.com/blog/the-quickest-way-to-fail-a-tech-interview/',
    likes: 2
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

const listWithManyUsers = [
  {
    username: 'zerocool',
    name: 'Dade Murphy',
    passwordHash: 'loocorez'
  },
  {
    username: 'acidburn',
    name: 'Kate Libby',
    passwordHash: 'nrubdica'
  },
  {
    username: 'cerealkiller',
    name: 'Emmanuel Goldstein',
    passwordHash: 'relliklaerec'
  },
  {
    username: 'lordnikon',
    name: 'Paul Cook',
    passwordHash: 'nokindrol'
  }
]


module.exports = {
  addAcidburnUser,
  addMultipleBlogs,
  addIndividualUser,
  addMultipleUsers,
  addThreeBlogsWithUserId,
  createUserAndEstablishItLoggedIn,
  createAnotherUserAndEstablishItLoggedIn,
  getBlogsInDb,
  getUsersInDb,
  individualBlog,
  individualUser,
  listWithManyBlogs,
  listWithManyUsers
}