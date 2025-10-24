describe('Homepage', () => {
  it('has the correct page title', () => {
    cy.visit('/')
    cy.title().should('eq', 'Knitting Buddy')
  })
})
