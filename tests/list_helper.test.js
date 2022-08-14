const listHelper = require('../utils/list_helper')

const listWithNoBlogs = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithManyBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '61dc78ce53d167a48734aaf7',
    title: 'Better tooling wont fix your API',
    author: 'Swizec Teller',
    url: 'https://swizec.com/blog/better-tooling-wont-fix-your-api/',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '61dc844a82be32a99cabcaeb',
    title: 'How GraphQL blows REST out of water',
    author: 'Swizec Teller',
    url: 'https://swizec.com/blog/how-graphql-blows-rest-out-of-the-water/',
    likes: 3,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '61ddd8972d4d44dfc2b13bc4',
    title: 'The quickest way to fail a tech interview',
    author: 'Swizec Teller',
    url: 'https://swizec.com/blog/the-quickest-way-to-fail-a-tech-interview/',
    likes: 2,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result  = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithNoBlogs)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(53)
  })
})

describe('favourite blog', () => {
  test('returns empty object when no blogs', () => {
    const result = listHelper.favouriteBlog(listWithNoBlogs)

    expect(result).toEqual({})
  })

  test('returns the right blog when only one blog', () => {
    const expectedResult = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }

    const result = listHelper.favouriteBlog(listWithOneBlog)

    expect(result).toEqual(expectedResult)

  })
})

test('return the right blog when many blogs', () => {
  const expectedResult = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  }

  const result = listHelper.favouriteBlog(listWithManyBlogs)

  expect(result).toEqual(expectedResult)
})

describe('author with most blogs', () => {
  test('return empty object when no blogs', () => {
    const expectedResult = {}

    const result = listHelper.mostBlogs(listWithNoBlogs)

    expect(result).toEqual(expectedResult)
  })

  test('return right author when one blog', () => {
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }

    const result = listHelper.mostBlogs(listWithOneBlog)

    expect(result).toEqual(expectedResult)
  })

  test('return right author when many blogs', () => {
    const expectedResult = {
      author: 'Swizec Teller',
      blogs: 3
    }

    const result = listHelper.mostBlogs(listWithManyBlogs)

    expect(result).toEqual(expectedResult)
  })
})

describe('author with most likes', () => {
  test('return empty object when empty list of blogs', () => {
    const expectedResult = {}

    const result = listHelper.mostLikes(listWithNoBlogs)

    expect(result).toEqual(expectedResult)
  })

  test('return right author with one blog', () => {
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }

    const result = listHelper.mostLikes(listWithOneBlog)

    expect(result).toEqual(expectedResult)
  })

  test('return right author when many blogs', () => {
    const expectedResult = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    const result = listHelper.mostLikes(listWithManyBlogs)

    expect(result).toEqual(expectedResult)
  })
})