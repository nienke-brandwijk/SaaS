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

  describe('Sidebar functionality', () => {
    it('renders the sidebar by default', () => {
      cy.get('aside').should('be.visible');
      cy.contains('1. Introduction').should('be.visible');
    });

    it('toggles sidebar visibility when clicking the toggle button', () => {
      // Sidebar should be open initially
      cy.get('aside.w-1\\/5').should('be.visible');
      
      // Click toggle button to close
      cy.get('button').find('svg').first().parent().click();
      cy.get('aside.w-1\\/5').should('not.exist');
      
      // Click toggle button to open again
      cy.get('button').find('svg').first().parent().click();
      cy.get('aside.w-1\\/5').should('be.visible');
    });

    it('displays all 7 menu items in the sidebar', () => {
      cy.get('aside a[href^="/learn/"]').should('have.length', 7);
      cy.contains('1. Introduction').should('exist');
      cy.contains('2 What do we use to knit?').should('exist');
      cy.contains('3 Cast on').should('exist');
      cy.contains('4 knit stitch').should('exist');
      cy.contains('5 Purl stitch').should('exist');
      cy.contains('6 Bind off').should('exist');
      cy.contains('7 The right size').should('exist');
    });

    it('navigates to correct page when clicking sidebar menu items', () => {
      cy.get('a[href="/learn/materials"]').first().click();
      cy.location('pathname').should('eq', '/learn/materials');
      cy.get('a[href="/learn/materials"]').should('have.class', 'bg-colorBtn');
    });
  });

  describe('Navigation buttons', () => {
    it('displays both Back and Next buttons', () => {
      cy.contains('Back').should('exist');
      cy.contains('Next').should('exist');
    });

    it('hides Back button on first page', () => {
      cy.visit('/learn/introduction');
      cy.contains('Back').should('have.class', 'invisible');
    });

    it('hides Next button on last page', () => {
      cy.visit('/learn/size');
      cy.contains('Next').should('have.class', 'invisible');
    });

    it('navigates to next page when clicking Next button', () => {
      cy.visit('/learn/introduction');
      cy.contains('Next').click();
      cy.location('pathname').should('eq', '/learn/materials');
    });

    it('navigates to previous page when clicking Back button', () => {
      cy.visit('/learn/materials');
      cy.contains('Back').click();
      cy.location('pathname').should('eq', '/learn/introduction');
    });

    it('navigates through all pages sequentially', () => {
      const pages = [
        '/learn/introduction',
        '/learn/materials',
        '/learn/cast-on',
        '/learn/knit-stitch',
        '/learn/purl-stitch',
        '/learn/bind-off',
        '/learn/size'
      ];

      pages.forEach((page, index) => {
        cy.location('pathname').should('eq', page);
        if (index < pages.length - 1) {
          cy.contains('Next').click();
        }
      });
    });
  });
});