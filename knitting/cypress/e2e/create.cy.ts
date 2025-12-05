describe.only('Create page - basic correctness', () => {
    
    describe('Unauthenticated user', () => {
        beforeEach(() => {
            // Clear any existing session/cookies
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.window().then((win) => {
                win.sessionStorage.clear();
            });
        });

        it('shows login popup for unauthenticated users', () => {
            cy.visit('/create');
            
            // Check popup is visible
            cy.contains('h2', 'Login Required').should('be.visible');
            cy.contains('You need to be logged in to use the Create page').should('be.visible');
        });

        it('redirects to login page when clicking Sign In', () => {
            cy.visit('/create');
            
            cy.contains('button', 'Sign In').click();
            cy.url().should('include', '/login');
            cy.url().should('include', 'redirect=%2Fcreate');
        });

        it('redirects to home when clicking Back to Home', () => {
            cy.visit('/create');
            
            cy.contains('button', 'Back to Home').click();
            
            // Wait for navigation to complete
            cy.url({ timeout: 10000 }).should('not.include', '/create');
        });
    });

    context('Authenticated user - with data', () => {
        before(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit('/login');
            cy.get('input[type="text"]').clear().type('pintelon.zoe@gmail.com');
            cy.get('input[type="password"]').clear().type('HalloHallo');
            cy.get('button[type="submit"]').contains('Sign In').click();
            cy.url({ timeout: 10000 }).should('not.include', '/login');
        });
        
        beforeEach(() => {
            cy.visit('/create');
        });

        describe('WIPs section', () => {

            it('displays WIPs section title and add button', () => {
                cy.contains('h1', 'WIPS: Work In Progress').should('be.visible');
                cy.get('button').contains('+').should('be.visible');
            });

            it('displays WIP carousel when WIPs exist', () => {
                // Check if carousel structure exists
                cy.get('.card-body').first().should('be.visible');
            });

            it('displays WIP name', () => {
                cy.get('h2').should('exist');
            });

            it('displays WIP image or placeholder', () => {
                cy.get('img[alt]').should('exist');
            });
        });

        describe('Visionboards section', () => {
            it('displays Visionboards section title and add button', () => {
                cy.contains('h1', 'Vision boards').should('be.visible');
                cy.get('button').contains('+').should('be.visible');
            });

            it('add button navigates to visionboards page', () => {
                cy.contains('h1', 'Vision boards')
                    .parent()
                    .find('button')
                    .contains('+')
                    .click();
                
                cy.url({ timeout: 10000 }).should('include', '/visionboards');
            });
        });
    });

    context('Authenticated user - without data', () => {
        before(() => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit('/login');
            cy.get('input[type="text"]').clear().type('nienke.brandwijk@gmail.com');
            cy.get('input[type="password"]').clear().type('knittingbuddy');
            cy.get('button[type="submit"]').contains('Sign In').click();
            cy.url({ timeout: 10000 }).should('not.include', '/login');
        });

        beforeEach(() => {
            cy.visit('/create');
        });

        it('shows "Start your first project" button when no WIPs', () => {
            cy.contains('Start your first project!').should('be.visible');
        });

        it('start project button is clickable', () => {
            cy.contains('button', 'Start your first project!').should('not.be.disabled');
        });
    

        // it('shows "Create your first visionboard" button when no boards and is clickable', () => {
        //     cy.contains('button', 'Create your first visionboard!', { timeout: 10000 })
        //         .scrollIntoView()
        //         .should('be.visible')
        //         .and('not.be.disabled')
        //         .click({ force: true });

        //     // Add a small wait to let the navigation start
        //     cy.wait(1000);

        //     // Increase timeout significantly
        //     cy.url({ timeout: 15000 }).should('not.include', '/create');
        //     cy.url({ timeout: 15000 }).should('include', '/visionboards');
        // });
    });
});