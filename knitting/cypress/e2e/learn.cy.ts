describe.only('Learn pages - basic correctness', () => {
  beforeEach(() => {
    cy.visit('/learn/introduction');
  });

  it('renders the main heading and expected paragraph content', () => {
    cy.get('h1').should('exist');

    // Content assertions (use case-insensitive regex to match text snippets)
    cy.contains(/Knitting is a relaxing/i).should('exist');
    cy.contains(/Begin by learning the basics/i).should('exist');
    cy.contains(/Understanding common knitting terms/i).should('exist');
  });

  it('has learn navigation links and clicking one navigates to another learn page', () => {
    // there should be at least one internal learn link
    cy.get('a[href^="/learn/"]').its('length').should('be.gte', 1);

    // click the first learn link and assert path changed and a heading is present
    cy.get('a[href^="/learn/"]').first().click();
    cy.location('pathname').should('match', /^\/learn\/.+/);
    cy.get('h1').should('exist');
  });

  it('marks the current learn page as active in the sidebar', () => {
    // visit a known learn page and assert the corresponding menu item is highlighted
    cy.visit('/learn/purl-stitch');
    cy.get('a[href="/learn/purl-stitch"]').should('have.class', 'bg-colorBtn');
  });
});