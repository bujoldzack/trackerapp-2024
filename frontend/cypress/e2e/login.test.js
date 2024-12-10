describe('Login', () => {
    it('should login successfully', () => {
      cy.visit('http://localhost:5000/')
      cy.get('#username').type('johndoe')
      cy.get('#password').type('Password123$')
      cy.get('button').click()
      cy.url().should('eq', 'http://localhost:5000/dashboard')
    })

    it('should display error message', () => {
      cy.visit('http://localhost:5000/')
      cy.get('#username').type('johndoe')
      cy.get('#password').type('Password123')
      cy.get('button').click()
      cy.contains('Invalid username or password')
    })

    it('should ask for information', () => {
      cy.visit('http://localhost:5000/')
      cy.contains('Login').click()
    })

    it('should redirect to login page', () => {
      cy.visit('http://localhost:5000/dashboard')
      cy.url().should('eq', 'http://localhost:5000/login')
    })
  })