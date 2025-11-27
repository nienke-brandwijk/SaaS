describe.only('Dictionary page - basic correctness', () => {
    beforeEach(() => {
        cy.visit('/dictionary');
    });

    it('renders title and description', () => {
        cy.get('h1').should('contain.text', 'Welcome to the Knitting Dictionary');
        cy.get('p').should('contain.text', 'Select a term from the sidebar to view its definition');
    });

    describe('Sidebar functionality', () => {
        it('displays the sidebar by default', () => {
            // Initially, sidebar should be visible
            cy.get('aside').should('be.visible');
            cy.get('h2').should('contain.text', 'Dictionary');
        });

        it('can toggle the sidebar visibility', () => {
            cy.contains('button', '❮❮❮').should('be.visible');
            
            //close sidebar
            cy.contains('button', '❮❮❮').click();
            cy.contains('button', '❯❯❯').should('be.visible');
            cy.contains('h2', 'Dictionary').should('not.exist');
            
            //open sidebar again
            cy.contains('button', '❯❯❯').click();
            cy.contains('button', '❮❮❮').should('be.visible');
            cy.contains('h2', 'Dictionary').should('be.visible');
        });

        it('filters words based on search input', () => {
            cy.get('input[placeholder="Search words..."]').should('be.visible');
            cy.get('input[placeholder="Search words..."]').type('cast on');
            
            cy.contains('button', 'italian cast on').should('be.visible');
            cy.contains('button', 'long tail cast on').should('be.visible');
            cy.contains('button', 'provisional cast on').should('be.visible');
            cy.contains('button', 'knit stitch').should('not.exist');
        });
    });

    describe('Word selection and definition display', () => {
        it('displays definition when a word is selected', () => {
            // Use more specific selector instead of .within()
            cy.get('aside').first().within(() => {
                cy.contains('button', 'knit stitch').click();
            });
            cy.get('h1').should('contain.text', 'knit stitch'); // Changed to lowercase to match actual output
            cy.get('p').should('contain.text', 'A knit stitch is the most basic stitch in knitting');
        });

        it('highlights the selected word in the sidebar', () => {
            cy.get('aside').first().within(() => {
                cy.contains('button', 'purl stitch').click();
            });
            // Check the class outside of .within() for more reliable testing
            cy.contains('button', 'purl stitch').should('have.class', 'bg-colorBtn'); // Updated class name based on your code
        });
    });

});