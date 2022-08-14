import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const testBlog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  user: {
    username: 'acidburn',
    name: 'Kate Libby',
    id: '61e44b8aa3e17777cf7fce8c'
  },
  id: '61e7094634ccc6bd2942d5ee'
}

test('first only renders the title and the author of the blog', () => {
  const renderedComponent = render(
    <Blog blog={testBlog} updateBlog={() => {}} removeBlog={() => {}} />
  )

  const additionalInfo = renderedComponent.container.querySelector('.additionalBlogInfo')
  expect(additionalInfo).toHaveStyle('display: none')

  expect(renderedComponent.container).toHaveTextContent('view')
})

test('after clicking the view button url and number of likes are shown', () => {
  const renderedComponent = render(
    <Blog blog={testBlog} updateBlog={() => {}} removeBlog={() => {}} />
  )

  const additionalInfoButton = renderedComponent.getByText('view')
  fireEvent.click(additionalInfoButton)

  const additionalInfo = renderedComponent.container.querySelector('.additionalBlogInfo')
  expect(additionalInfo).not.toHaveStyle('display: none')

  expect(renderedComponent.container).toHaveTextContent('hide')
})

test('if the like button is clicked twice, the event handler is called twice', () => {
  const mockHandler = jest.fn()

  const renderedComponent = render(
    <Blog blog={testBlog} updateBlog={mockHandler} removeBlog={() => {}} />
  )

  const additionalInfoButton = renderedComponent.getByText('view')
  fireEvent.click(additionalInfoButton)

  const likeButton = renderedComponent.getByText('like')
  fireEvent.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(1)

  fireEvent.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})