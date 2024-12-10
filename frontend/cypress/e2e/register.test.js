describe('Register', () => {
  it('should register a new user', () => {
    cy.visit('http://localhost:5000/')

    cy.contains('Register').click()

    cy.get('#name').type('John Doe')
    cy.get('#username').type('johndoe')
    cy.get('#password').type('Password123$')
    cy.get('button').click()

    cy.url().should('eq', 'http://localhost:5000/login')
  })

  it('should display error message', () => {
    cy.visit('http://localhost:5000/')

    cy.contains('Register').click()

    cy.get('#name').type('John Doe')
    cy.get('#username').type('johndoe')
    cy.get('#password').type('Password123')
    cy.get('button').click()

    cy.contains('Password must include at least one number and one special character.')
  })

  it('should ask for information', () => {
    cy.visit('http://localhost:5000/')

    cy.contains('Register').click()
    cy.get('button').click()

    cy.contains('Name is required.')
    cy.contains('Username is required.')
    cy.contains('Password is required.')
  })
})