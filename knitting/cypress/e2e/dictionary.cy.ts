describe.only('Dictionary page - basic correctness', () => {
    beforeEach(() => {
        cy.visit('/dictionary');
    });

    it('renders title and description', () => {
        cy.get('h1').should('contain.text', 'Welcome to the Knitting Dictionary');
        cy.get('p').should('contain.text', 'Select a term from the sidebar to view its definition');
    });

    describe('Sidebar functionality', () => {

      it('should display the sidebar by default', () => {
            // Check if sidebar is visible (sidebar with specific width class)
            cy.get('aside.w-1\\/5').should('be.visible');
            
            // Verify sidebar contains expected content
            cy.contains('Dictionary').should('be.visible');
            cy.get('input[placeholder="Search words..."]').should('be.visible');
        });

        it('should display the toggle button', () => {
            // Check if toggle button exists and contains an SVG
            cy.get('button svg').should('exist');
        });

        it('should close the sidebar when toggle button is clicked', () => {
            // Verify sidebar is initially open
            cy.get('aside.w-1\\/5').should('be.visible');
            
            // Click the toggle button (button that contains SVG)
            cy.get('button').find('svg').first().parent().click();
            
            // Verify sidebar is now hidden
            cy.get('aside.w-1\\/5').should('not.exist');
        });

        it('should reopen the sidebar when toggle button is clicked again', () => {
            // Close the sidebar first
            cy.get('button').find('svg').first().parent().click();
            cy.get('aside.w-1\\/5').should('not.exist');
            
            // Click toggle button again to reopen
            cy.get('button').find('svg').first().parent().click();
            
            // Verify sidebar is visible again
            cy.get('aside.w-1\\/5').should('be.visible');
            cy.contains('Dictionary').should('be.visible');
        });


        it('filters words based on search input', () => {
            cy.get('input[placeholder="Search words..."]').should('be.visible');
            cy.get('input[placeholder="Search words..."]').type('cast on');
            
            // Check that filtered words are visible
            cy.get('aside').contains('button', 'italian cast on').should('be.visible');
            cy.get('aside').contains('button', 'long tail cast on').should('be.visible');
            cy.get('aside').contains('button', 'provisional cast on').should('be.visible');
            
            // Check that non-matching words are not in the list
            cy.get('aside').contains('button', 'knit stitch').should('not.exist');
        });
    });

    describe('Word selection and definition display', () => {
        it('displays definition when a word is selected', () => {
            // Click on a word in the sidebar
            cy.get('aside').contains('button', 'knit stitch').click();
            
            // Wait for navigation
            cy.wait(500);
            
            // Verify URL changed
            cy.url().should('include', '/dictionary/knit-stitch');
            
            // Verify content in main area
            cy.get('main').find('h1').should('contain.text', 'knit stitch');
            cy.get('main').find('p').should('contain.text', 'A knit stitch is the most basic stitch in knitting');
        });

        it('highlights the selected word in the sidebar', () => {
            // Click on a word
            cy.get('aside').contains('button', 'purl stitch').click();
            
            // Wait for navigation and state update
            cy.wait(500);
            
            // Verify URL changed
            cy.url().should('include', '/dictionary/purl-stitch');
            
            // Check that the selected button has the active styling
            cy.get('aside').contains('button', 'purl stitch')
                .should('have.class', 'bg-colorBtn')
                .and('have.class', 'text-txtColorBtn');
        });
    });
});