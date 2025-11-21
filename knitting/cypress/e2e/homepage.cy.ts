describe('Homepage', () => {
  it('has the correct page title', () => {
    cy.visit('/')
    cy.contains('button', 'Learn')
  })
})
