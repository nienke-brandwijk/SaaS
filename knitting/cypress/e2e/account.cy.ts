describe.only('Profile Page', () => {
   beforeEach(() => {
  cy.session('userSession', () => {
    cy.visit('/login');
    cy.get('input[type="text"]').type('pintelon.zoe@gmail.com');
    cy.get('input[type="password"]').type('HalloHallo');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  cy.visit('/account');
  cy.contains('button', 'Logout', { timeout: 10000 }).should('be.visible');
});


  it('should display logout button', () => {
    cy.contains('button', 'Logout').should('be.visible');
  });

  it('should display user information card', () => {
    cy.contains('Zoë Pintelon').should('be.visible');
    cy.contains('pintelon.zoe@gmail.com').should('be.visible');
    cy.contains('zoep').should('be.visible');
  });

  it('should display profile image', () => {
    cy.get('img[alt="account image"]').should('be.visible');
  });

  it('should display learning progress section', () => {
    cy.contains('Learning Progress').should('be.visible');
    cy.contains('Get back to learning').should('be.visible');
  });

  it('should display your creations section', () => {
    cy.contains('Your Creations').should('be.visible');
  });

   it('should handle logout', () => {
    cy.contains('button', 'Logout').click();
    cy.url().should('include', '/');
  });
});