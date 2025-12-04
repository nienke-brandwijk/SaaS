describe.only('Vision Board Page - Essential Tests', () => {
  beforeEach(() => {
    // Mock logged-in user
    cy.intercept('GET', '/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    }).as('getSession');

    cy.visit('/visionboards');
  });

  describe('Page Structure', () => {
    it('renders all main sections', () => {
      cy.contains('h1', 'Your Vision Board').should('be.visible');
      cy.contains('h1', 'Vision Board Title').should('be.visible');
      cy.contains('h1', 'Tools').should('be.visible');
    });

    it('displays empty board with placeholder message', () => {
      cy.contains('Your vision board will appear here').should('be.visible');
      cy.contains('Drag images and text to create your board').should('be.visible');
    });

    it('shows save and back buttons', () => {
      cy.contains('button', 'Back').should('be.visible');
      cy.contains('button', 'Save Vision Board').should('be.visible');
    });
  });

  describe('Image Upload', () => {
    it('shows upload button and empty state', () => {
      cy.contains('button', 'Upload Images').should('be.visible');
      cy.contains('No images uploaded yet').should('be.visible');
    });

    it('uploads an image to gallery', () => {
      const fileName = 'account.png';
      
      // Create a test image file
      cy.fixture('account.png', 'base64').then(fileContent => {
        cy.get('input[type="file"]').selectFile(
          {
            contents: Cypress.Buffer.from(fileContent, 'base64'),
            fileName: fileName,
            mimeType: 'image/png'
          },
          { force: true }
        );
      });

      // Verify image appears in gallery
      cy.get('.grid.grid-cols-2 img').should('exist');
      cy.contains('No images uploaded yet').should('not.exist');
    });

    it('removes image from gallery when clicking trash icon', () => {
      // Upload an image first
      cy.fixture('account.png', 'base64').then(fileContent => {
        cy.get('input[type="file"]').selectFile(
          {
            contents: Cypress.Buffer.from(fileContent, 'base64'),
            fileName: 'account.png',
            mimeType: 'image/png'
          },
          { force: true }
        );
      });

      // Hover over image and click trash button
      cy.get('.grid.grid-cols-2 .relative.group').first().trigger('mouseenter');
      cy.get('.grid.grid-cols-2 .relative.group button').first().click();
      
      // Verify image is removed
      cy.contains('No images uploaded yet').should('be.visible');
    });
  });

  describe('Add Text', () => {
    it('allows user to add text to board', () => {
      const testText = 'Dream Big';
      
      cy.get('input[placeholder="Your affirmation..."]')
        .type(testText)
        .should('have.value', testText);
      
      cy.contains('button', 'Add to Board').click();
      
      // Verify text appears on board
      cy.get('[data-board-capture="true"]').within(() => {
        cy.contains(testText).should('be.visible');
      });
      
      // Verify input is cleared
      cy.get('input[placeholder="Your affirmation..."]').should('have.value', '');
    });

    it('adds text when pressing Enter key', () => {
      const testText = 'Stay Focused';
      
      cy.get('input[placeholder="Your affirmation..."]')
        .type(testText)
        .type('{enter}');
      
      cy.get('[data-board-capture="true"]').within(() => {
        cy.contains(testText).should('be.visible');
      });
    });

    it('removes text item from board when clicking X button', () => {
      const testText = 'Test Text';
      
      // Add text to board
      cy.get('input[placeholder="Your affirmation..."]')
        .type(testText)
        .type('{enter}');
      
      // Hover over text item and click remove button
      cy.contains(testText).parent().parent().trigger('mouseenter');
      cy.contains(testText).parent().parent().find('button').click();
      
      // Verify text is removed
      cy.contains(testText).should('not.exist');
    });
  });

  describe('Back Navigation', () => {
    it('navigates back immediately when no changes made', () => {
      cy.contains('button', 'Back').click();
      cy.location('pathname').should('eq', '/create');
    });

    it('shows confirmation modal when changes exist', () => {
      // Make a change
      cy.get('input#boardTitle').type('Some Title');
      
      cy.contains('button', 'Back').click();
      
      cy.contains('Are you sure you want to leave?').should('be.visible');
      cy.contains('You already made some changes').should('be.visible');
    });

    it('cancels back navigation when clicking No', () => {
      // Make a change
      cy.get('input#boardTitle').type('Some Title');
      
      cy.contains('button', 'Back').click();
      cy.contains('button', 'No').click();
      
      // Modal should close
      cy.contains('Are you sure you want to leave?').should('not.exist');
      // Should still be on vision board page
      cy.contains('h1', 'Your Vision Board').should('be.visible');
    });

    it('confirms back navigation when clicking Yes', () => {
      // Make a change
      cy.get('input#boardTitle').type('Some Title');
      
      cy.contains('button', 'Back').click();
      cy.contains('button', 'Yes').click();
      
      cy.location('pathname').should('eq', '/create');
    });
  });

  describe('Board Interactions', () => {
    it('allows dragging text items on the board', () => {
      // Add text to board
      cy.get('input[placeholder="Your affirmation..."]')
        .type('Draggable Text')
        .type('{enter}');
      
      // Verify text is draggable
      cy.contains('Draggable Text')
        .parent()
        .parent()
        .should('have.attr', 'draggable', 'true');
    });
  });
});