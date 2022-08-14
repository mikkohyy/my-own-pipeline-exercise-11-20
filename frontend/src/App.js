import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Button from './components/Button'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [successfulOperation, setSuccessfulOperation] = useState(null)
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleCreateBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog)
      const updatedBlogs = blogs.concat(response)
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
      notifyUser(`a new blog ${response.title} by ${response.author} was added`, true)
      blogFormRef.current.toggleVisibility()
    } catch(expection) {
      notifyUser('adding the blog failed', false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedInUser)
      )

      blogService.setToken(loggedInUser.token)

      setUser(loggedInUser)
      setUsername('')
      setPassword('')
      notifyUser(`logged in ${loggedInUser.name}`, true)
    } catch (expection) {
      notifyUser('Wrong username or password', false)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    notifyUser(`logged out ${user.name}`, true)
    setUser(null)
    blogService.setToken(null)
  }

  const handleUpdateBlog = async (updatedInfo) => {
    const updatedBlog = await blogService.update(updatedInfo)
    const updatedBlogs = blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
    const sortedUpdatedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sortedUpdatedBlogs)
  }

  const notifyUser = ( message, wasSuccessful ) => {
    setNotificationMessage(message)
    setSuccessfulOperation(wasSuccessful)

    setTimeout(() => {
      setNotificationMessage(null)
      setSuccessfulOperation(null)
    }, 5000)
  }

  const handleRemoveBlog = async (blogToBeRemoved) => {
    try {
      await blogService.remove(blogToBeRemoved.id)
      notifyUser(`Deleted ${blogToBeRemoved.title} by ${blogToBeRemoved.author}`, true)
      const updatedBlogs = blogs.filter(blog => blog.id !== blogToBeRemoved.id)
      setBlogs(updatedBlogs)
    } catch (expection) {
      notifyUser('Was not able to delete the blog', false)
    }
  }

  if (user === null) {
    return(
      <div>
        <h2>Log in to the application</h2>
        <Notification successful={successfulOperation} message={notificationMessage} />
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    )
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification successful={successfulOperation} message={notificationMessage} />
        <p>{`${user.name} logged in`} <Button text="logout" onClick={handleLogout} /></p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <h2>create new</h2>
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>
        <br/>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={handleUpdateBlog}
            removeBlog={handleRemoveBlog}
          />
        )}
      </div>
    )
  }
}

export default App