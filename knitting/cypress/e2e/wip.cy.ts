describe.only('WIP (Work In Progress) Page - Essential Tests', () => {
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

    cy.visit('/wips');
  });

  describe('Page Structure', () => {
    it('renders the main heading and sections', () => {
      cy.contains('h1', 'Your new WIP').should('be.visible');
      cy.contains('Give your WIP a name').should('be.visible');
      cy.contains('WIP details').should('be.visible');
      cy.contains('Comments').should('be.visible');
    });

    it('displays save and back buttons', () => {
      cy.contains('button', 'Back').should('be.visible');
      cy.contains('button', 'Save WIP').should('be.visible');
    });

    it('shows all WIP detail sections', () => {
      cy.contains('h3', 'Needles').should('be.visible');
      cy.contains('h3', 'Yarn').should('be.visible');
      cy.contains('h3', 'Gauge swatch').should('be.visible');
      cy.contains('h3', 'Size').should('be.visible');
      cy.contains('h3', 'Chest circumference').should('be.visible');
      cy.contains('h3', 'Ease').should('be.visible');
      cy.contains('h3', 'Extra materials').should('be.visible');
      cy.contains('h3', 'Current position').should('be.visible');
    });
  });

  describe('Image Upload', () => {
    const createTestImage = () => {
      return cy.window().then((win) => {
        return new Promise<Blob>((resolve) => {
          const canvas = win.document.createElement('canvas');
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(0, 0, 100, 100);
          }
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/jpeg');
        });
      });
    };

    it('shows upload button when no image is selected', () => {
      cy.contains('button', 'Upload image').should('be.visible');
    });

    it('uploads and displays an image', () => {
      createTestImage().then((blob) => {
        const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        cy.get('input[type="file"]').then(input => {
          const inputElement = input[0] as HTMLInputElement;
          inputElement.files = dataTransfer.files;
          cy.wrap(input).trigger('change', { force: true });
        });
      });

      // Wait for image to load and verify it appears
      cy.get('img', { timeout: 10000 }).should('exist').and('be.visible');
      cy.contains('button', 'Upload image').should('not.exist');
    });

    it('removes uploaded image when clicking delete button', () => {
      createTestImage().then((blob) => {
        const file = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        cy.get('input[type="file"]', { timeout: 10000 }).then(input => {
          const inputElement = input[0] as HTMLInputElement;
          inputElement.files = dataTransfer.files;
          cy.wrap(input).trigger('change', { force: true });
        });
      });

      cy.get('button[aria-label="remove picture"]', { timeout: 10000 }).click();
      cy.get('img[src^="data:"]').should('not.exist');
      cy.contains('button', 'Upload image').should('be.visible');

    });
  });

  describe('Needles Management', () => {
    it('opens modal when clicking add needle button', () => {
      cy.contains('h3', 'Needles').parent().find('button[aria-label="Add needle"]').click();
      cy.contains('h2', 'Add needle').should('be.visible');
    });
  });

  describe('Yarn Management', () => {
    it('opens modal when clicking add yarn button', () => {
      cy.contains('h3', 'Yarn').parent().find('button[aria-label="Add yarn"]').click();
      cy.contains('h2', 'Add yarn').should('be.visible');
    });
  });

  describe('Gauge Swatch Management', () => {
    it('opens modal when clicking add gauge swatch button', () => {
      cy.contains('h3', 'Gauge swatch').parent().find('button[aria-label="Add gauge swatch"]').click();
      cy.contains('h2', 'Add gauge swatch').should('be.visible');
    });
  });

  describe('Size Management', () => {
    it('opens modal when clicking add size button', () => {
      cy.contains('h3', 'Size').parent().find('button[aria-label="Add size"]').click();
      cy.contains('h2', 'Add size').should('be.visible');
    });

  //  it('adds a size', () => {
  //     cy.contains('h3', 'Size').parent().find('button[aria-label="Add size"]').click();
      
  //     // Wait for modal
  //     cy.contains('h2', 'Add size').should('be.visible');
      
  //     // Type in the visible input (since modal is the only thing visible)
  //     cy.get('.fixed input[type="text"]').type('Medium');
      
  //     // Click Save button in the modal
  //     cy.get('.fixed button').contains('Save').click();

  //     // Verify the size appears
  //     cy.contains('Medium').should('be.visible');
  //   });
  });

  describe('Measurements', () => {
    it('allows user to enter chest circumference', () => {
      cy.get('.flex-1.space-y-2').eq(0).within(() => {
        cy.get('input').type('90');
      });
      
      cy.get('.flex-1.space-y-2').eq(0).within(() => {
        cy.get('input').should('have.value', '90');
      });
    });

    it('allows user to enter ease', () => {
      cy.get('.flex-1.space-y-2').eq(1).within(() => {
        cy.get('input').type('10');
      });
      
      cy.get('.flex-1.space-y-2').eq(1).within(() => {
        cy.get('input').should('have.value', '10');
      });
    });
  });

  describe('Extra Materials Management', () => {
    it('opens modal when clicking add extra material button', () => {
      cy.contains('h3', 'Extra materials').parent().find('button[aria-label="Add extra material"]').click();
      cy.contains('h2', 'Add extra material').should('be.visible');
    });
  });

  describe('Current Position', () => {
    it('allows user to add notes about current position', () => {
      cy.contains('h3', 'Current position').parent().find('textarea').type('Test');
      cy.contains('h3', 'Current position').parent().find('textarea').should('have.value', 'Test');
    });
  });
});