/**
 * @jest-environment jsdom
 */


import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('calls the event handler with the right details when a new blog is created', () => {
  const mockCreateHandler = jest.fn()

  const blogTitle = 'React patterns'
  const blogAuthor = 'Michael Chan'
  const blogUrl = 'https://reactpatterns.com/'

  const renderedComponent = render(
    <BlogForm createBlog={mockCreateHandler} />
  )

  const title = renderedComponent.container.querySelector('#title')
  const author = renderedComponent.container.querySelector('#author')
  const url = renderedComponent.container.querySelector('#url')
  const form = renderedComponent.container.querySelector('#newBlogForm')

  fireEvent.change(title, {
    target: { value: blogTitle }
  })

  fireEvent.change(author, {
    target: { value: blogAuthor },
  })

  fireEvent.change(url, {
    target: { value: blogUrl }
  })

  fireEvent.submit(form)

  expect(mockCreateHandler.mock.calls).toHaveLength(1)
  expect(mockCreateHandler.mock.calls[0][0].author).toBe(blogAuthor)
  expect(mockCreateHandler.mock.calls[0][0].title).toBe(blogTitle)
  expect(mockCreateHandler.mock.calls[0][0].url).toBe(blogUrl)
})