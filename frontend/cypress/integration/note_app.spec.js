describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      username: 'zerocool',
      name: 'Dade Murphy',
      password: 'loocorez'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to the application')
    cy.get('#login-form')
      .should('contain', 'username')
      .and('contain', 'password')
    cy.get('#login-button').should('contain', 'login')
  })

  describe('Login', function() {
    it('Succeeds with correct credentials', function() {
      cy.get('#login-input-username').type('zerocool')
      cy.get('#login-input-password').type('loocorez')
      cy.get('#login-button').click()

      cy.get('.notification-field')
        .should('contain', 'logged in Dade Murphy')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.contains('blogs')
      cy.contains('create new')
    })

    it('Fails with wrong credentials', function() {
      cy.get('#login-input-username').type('zerocool')
      cy.get('#login-input-password').type('i-hack')
      cy.get('#login-button').click()

      cy.get('.notification-field')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('#login-form')
        .should('contain', 'username')
        .and('contain', 'password')
      cy.get('#login-button').should('contain', 'login')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login('zerocool', 'loocorez')
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('React patterns')
      cy.get('#author').type('Michael Chan')
      cy.get('#url').type('https://reactpatterns.com/')
      cy.get('#create-button').click()

      cy.get('.blog:first')
        .should('contain', '"React patterns" by Michael Chan')

      cy.get('.notification-field')
        .should('contain', 'a new blog React patterns by Michael Chan was added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
    })

    describe('When a blog exists', function() {
      beforeEach(function() {
        cy.contains('create new blog').click()
        cy.get('#title').type('React patterns')
        cy.get('#author').type('Michael Chan')
        cy.get('#url').type('https://reactpatterns.com/')
        cy.get('#create-button').click()
      })

      it('User can add a like to a blog', function() {
        cy.contains('view').click()
        cy.get('.blog-likes:first').should('contain', '0')
        cy.contains('like').click()
        cy.get('.blog-likes:first').should('contain', '1')
      })

      it('User can delete it', function() {
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.get('.notification-field')
          .should('contain', 'Deleted React patterns by Michael Chan')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
        cy.contains('"React patterns" by Michael Chan').should('not.exist')
      })

      it('Only user who has added the blog can delete it', function() {
        const user = {
          username: 'acidburn',
          name: 'Kate Libby',
          password: 'nrubdica'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)
        cy.contains('logout').click()

        cy.login('acidburn', 'nrubdica')

        cy.contains('view').click()
        cy.contains('remove').click()

        cy.get('.notification-field')
          .should('contain', 'Was not able to delete the blog')
          .and('have.css', 'color', 'rgb(255, 0, 0)')
        cy.contains('"React patterns" by Michael Chan')
      })
    })
  })
  describe('When many blogs', function() {
    it('Blogs are printed in the right order', function() {
      const rightBlogOrder = [
        'Canonical string reduction',
        'First class tests',
        'React patterns',
        'TDD harms architecture',
      ]

      cy.login('zerocool', 'loocorez')

      cy.addBlog({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
      })

      cy.addBlog({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      })

      cy.addBlog({
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
      })

      cy.addBlog({
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
      })

      cy.reload()

      cy.get('.blog-info')
        .then((blogs) => {
          let visibleBlogs = Cypress._.map(blogs, (blog) => { return blog.innerHTML })
          for (let i=0;i<rightBlogOrder.length;i++) {
            expect(visibleBlogs[i]).to.contain(rightBlogOrder[i])
          }
        })

    })
  })
})