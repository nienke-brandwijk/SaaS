describe.only('homepage - basic correctness', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders navbar with logo and links', () => {
    cy.get('img[alt="Knitting Icon"]').should('be.visible');
    
    // Check nav links
    cy.get('nav').first().should('be.visible');
    cy.get('nav').first().within(() => {
      cy.contains('a', 'Create').should('have.attr', 'href', '/create');
      cy.contains('a', 'Learn').should('have.attr', 'href', '/learn/introduction');
      cy.contains('a', 'Dictionary').should('have.attr', 'href', '/dictionary');
      cy.contains('a', 'Calculator').should('have.attr', 'href', '/calculator');
    });
  });

  it('renders homepage banner', () => {
    cy.get('img[alt="banner"]').should('be.visible');
  });

  it('renders first card with learn content', () => {
    // Check first paragraph in first card
    cy.contains('Want to stop fast fashion and be more sustainable').should('be.visible');
    cy.contains('step-by-step knitting program').should('have.class', 'text-txtTransBtn');
    cy.contains('made by you, for you').should('have.class', 'text-txtTransBtn');
    
    // Check Learn button exists and links correctly
    cy.contains('button', 'Learn')
      .should('be.visible')
      .parent('a')
      .should('have.attr', 'href', '/learn/introduction');
    
    // Check second paragraph in first card
    cy.contains('Already ready to take on a project?').should('be.visible');
    cy.contains("Let's get creative!").should('have.class', 'text-txtTransBtn');
    
    // Check Create button exists and links correctly
    cy.contains('button', 'Create')
      .should('be.visible')
      .parent('a')
      .should('have.attr', 'href', '/create');
  });

  it('renders second card with calculator and dictionary links', () => {
    // Check calculator text and link
    cy.contains('Need a hand with project calculations?').should('be.visible');
    cy.contains('a', 'calculators')
      .should('be.visible')
      .should('have.attr', 'href', '/calculator')
      .should('have.class', 'underline');
    
    // Check dictionary text and link
    cy.contains('Curious about a knitting term?').should('be.visible');
    cy.contains('a', 'dictionary')
      .should('be.visible')
      .should('have.attr', 'href', '/dictionary')
      .should('have.class', 'underline');
  });

  it('Learn button navigates to learn page', () => {
    cy.contains('button', 'Learn').click();
    cy.url().should('include', '/learn/introduction');
  });

  it('Create button navigates to create page', () => {
    cy.contains('button', 'Create').click();
    cy.url().should('include', '/create');
  });

  it('calculator link navigates to calculator page', () => {
    cy.contains('a', 'calculators').click();
    cy.url().should('include', '/calculator');
  });

  it('dictionary link navigates to dictionary page', () => {
    cy.contains('a', 'dictionary').click();
    cy.url().should('include', '/dictionary');
  });

  it('decorative needle images are present', () => {
    // Check for the decorative needle SVGs
    cy.get('img[alt="naalden"]').should('have.length', 2);
  });

  it('background is applied to page', () => {
    cy.get('.min-h-screen').should('have.class', 'bg-[url(\'/background.svg\')]');
  });
});