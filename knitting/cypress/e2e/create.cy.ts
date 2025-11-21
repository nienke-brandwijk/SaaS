describe.only('Create page - basic correctness', () => {
    
    describe('Unauthenticated user', () => {
        beforeEach(() => {
            // Clear any existing session/cookies
            cy.clearCookies();
            cy.clearLocalStorage();
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
            cy.url().should('eq', Cypress.config().baseUrl + '/');
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
                cy.contains('h1', 'Visionboards').should('be.visible');
                cy.get('button').contains('+').should('be.visible');
            });

            it('add button navigates to visionboards page', () => {
                cy.contains('h1', 'Visionboards')
                    .parent()
                    .find('button')
                    .contains('+')
                    .click();
                
                cy.url().should('include', '/visionboards');
            });

            // it('displays visionboard carousel', () => {
            //     cy.get('.carousel').should('exist');
            // });

            // it('displays visionboard images', () => {
            //     cy.get('.carousel-item img').should('exist');
            // });

            // it('visionboard images are clickable', () => {
            //     cy.get('.carousel-item').first().should('have.class', 'cursor-pointer');
            // });

            // it('navigates to specific visionboard when clicked', () => {
            //     cy.get('.carousel-item').first().click();
            //     cy.url().should('include', '/visionboards/');
            // });

            // it('carousel is horizontally scrollable', () => {
            //     cy.get('.carousel').should('have.class', 'overflow-x-auto');
            // });
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
            cy.location('pathname', { timeout: 10000 }).should(() => {});
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
    

        it('shows "Create your first visionboard" button when no boards and is clickable', () => {
            // the button can be clipped by overflow; scroll into view first
            cy.contains('button', 'Create your first visionboard!', { timeout: 10000 })
                .scrollIntoView()
                .should('be.visible')
                .and('not.be.disabled')
                .click({ force: true });

            cy.url({ timeout: 10000 }).should('include', '/visionboards');
        });

    });

    
    describe('Responsive layout', () => {
        beforeEach(() => {
            cy.visit('/create');
        });

        it('main content area is scrollable', () => {
            cy.get('.md\\:overflow-y-auto').should('exist');
        });

        it('page prevents overflow', () => {
            cy.get('.md\\:overflow-hidden').should('exist');
        });

        it('content is properly spaced', () => {
            cy.get('.space-y-16').should('exist');
        });
    });
});