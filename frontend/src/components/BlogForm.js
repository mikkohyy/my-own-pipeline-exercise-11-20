import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      author,
      title,
      url
    }
    createBlog(newBlog)
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return(
    <form id='newBlogForm' onSubmit={addBlog}>
      <div>
        title: <input id='title' type="text" value={title} name="Title" onChange={handleTitleChange} />
      </div>
      <div>
        author: <input id='author' type="text" value={author} name="Author" onChange={handleAuthorChange} />
      </div>
      <div>
        url: <input id='url' type="text" value={url} name="Url" onChange={handleUrlChange} />
      </div>
      <button id='create-button'>create</button>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm