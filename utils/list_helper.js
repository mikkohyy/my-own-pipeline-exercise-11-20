const _ = require('lodash')

const dummy = (blogs) => {
  blogs = 1
  return blogs
}

const favouriteBlog = (blogs) => {
  let favouriteBlogInfo = {}

  if (blogs.length !== 0) {

    const maxLikes = Math.max(...blogs.map((blog => blog.likes)))
    const blogWithMostLikes = blogs.find(blog => blog.likes === maxLikes)

    favouriteBlogInfo = {
      title: blogWithMostLikes.title,
      author: blogWithMostLikes.author,
      likes: blogWithMostLikes.likes
    }
  }

  return favouriteBlogInfo
}

const mostBlogs = (blogs) => {
  const authorSummary = _.reduce(blogs, (summaryByAuthor, blog) => {
    summaryByAuthor[blog.author] = (summaryByAuthor[blog.author] || 0) + 1
    return summaryByAuthor
  }, {})

  let authorsWithBlogs = []

  _.forIn(authorSummary, (value, key) => {
    const authorInfo = {
      author: key,
      blogs: value
    }
    authorsWithBlogs.push(authorInfo)
  })

  const authorWithMostBlogs = _.maxBy(authorsWithBlogs,'blogs')

  return authorWithMostBlogs || {}
}

const mostLikes = (blogs) => {
  const likesSummary = _.reduce(blogs, (authorLikes, blog) => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
    return authorLikes
  }, {})

  let authorsWithLikes = []

  _.forIn(likesSummary, (value, key) => {
    const authorInfo = {
      author: key,
      likes: value
    }
    authorsWithLikes.push(authorInfo)
  })

  const authorWithMostLikes = _.maxBy(authorsWithLikes, 'likes')

  return authorWithMostLikes || {}
}

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((sumOfLikes, blog) => {
    return sumOfLikes + blog.likes
  }, 0)
  return totalLikes
}

module.exports =  {
  dummy,
  favouriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes
}