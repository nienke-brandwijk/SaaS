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
      cy.contains('h1', 'Your new project').should('be.visible');
      cy.contains('Give your project a name').should('be.visible');
      cy.contains('Project details').should('be.visible');
      cy.contains('Comments').should('be.visible');
    });

    it('displays save and back buttons', () => {
      cy.contains('button', 'Back').should('be.visible');
      cy.contains('button', 'Save Project').should('be.visible');
    });

    it('shows all project detail sections', () => {
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

  describe('Project Name', () => {
    it('allows user to enter a project name', () => {
      cy.get('input#boardTitle')
        .should('have.attr', 'placeholder', 'e.g., Red Cardigan')
        .type('My Test Sweater')
        .should('have.value', 'My Test Sweater');
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

      // Verify image appears
      cy.get('.relative.w-2\\/3 img').should('exist').and('be.visible');
      cy.contains('button', 'Upload image').should('not.exist');
    });

    it('removes uploaded image when clicking delete button', () => {
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

      cy.get('button[aria-label="remove picture"]').click();
      cy.get('.relative.w-2\\/3 img').should('not.exist');
      cy.contains('button', 'Upload image').should('be.visible');
    });
  });

  describe('Comments', () => {
    it('allows user to add comments', () => {
      const testComment = 'This is my first sweater!';
      
      cy.get('input[placeholder="Add some comments here"]')
        .type(testComment)
        .should('have.value', testComment);
    });
  });

  describe('Needles Management', () => {
    it('opens modal when clicking add needle button', () => {
      cy.contains('h3', 'Needles').parent().find('button[aria-label="Add needle"]').click();
      cy.contains('h2', 'Add needle').should('be.visible');
    });

    it('adds a needle with size and part', () => {
      cy.contains('h3', 'Needles').parent().find('button[aria-label="Add needle"]').click();
      
      // The placeholders are "Size needle in mm (e.g., 4.0mm)" and "Section using this needle (e.g., Body, Sleeves)"
      cy.get('input').eq(0).type('4.0mm');
      cy.get('input').eq(1).type('Body');
      cy.contains('button', 'Save').click();

      cy.contains('4.0mm - Body').should('be.visible');
    });

    it('removes a needle when clicking delete button', () => {
      cy.contains('h3', 'Needles').parent().find('button[aria-label="Add needle"]').click();
      cy.get('input').eq(0).type('5.0mm');
      cy.get('input').eq(1).type('Sleeves');
      cy.contains('button', 'Save').click();

      cy.contains('5.0mm - Sleeves').parent().find('button').click();
      cy.contains('5.0mm - Sleeves').should('not.exist');
    });
  });

  describe('Yarn Management', () => {
    it('opens modal when clicking add yarn button', () => {
      cy.contains('h3', 'Yarn').parent().find('button[aria-label="Add yarn"]').click();
      cy.contains('h2', 'Add yarn').should('be.visible');
    });

    it('adds yarn with name and producer', () => {
      cy.contains('h3', 'Yarn').parent().find('button[aria-label="Add yarn"]').click();
      
      // Use eq to target inputs in order
      cy.get('input').eq(0).type('Cozy Wool');
      cy.get('input').eq(1).type('YarnCo');
      cy.contains('button', 'Save').click();

      cy.contains('Cozy Wool by YarnCo').should('be.visible');
    });

    it('removes yarn when clicking delete button', () => {
      cy.contains('h3', 'Yarn').parent().find('button[aria-label="Add yarn"]').click();
      cy.get('input').eq(0).type('Test Yarn');
      cy.get('input').eq(1).type('TestCo');
      cy.contains('button', 'Save').click();

      cy.contains('Test Yarn by TestCo').parent().find('button').click();
      cy.contains('Test Yarn by TestCo').should('not.exist');
    });
  });

  describe('Gauge Swatch Management', () => {
    it('opens modal when clicking add gauge swatch button', () => {
      cy.contains('h3', 'Gauge swatch').parent().find('button[aria-label="Add gauge swatch"]').click();
      cy.contains('h2', 'Add gauge swatch').should('be.visible');
    });

    it('adds gauge swatch with stitches and rows', () => {
      cy.contains('h3', 'Gauge swatch').parent().find('button[aria-label="Add gauge swatch"]').click();
      
      // Use within modal context and force typing
      cy.get('.fixed.inset-0').within(() => {
        cy.get('input').eq(0).type('10', { force: true });
        cy.get('input').eq(1).type('12', { force: true });
        cy.get('input').eq(2).type('stockinette', { force: true });
        cy.contains('button', 'Save').click();
      });

      cy.contains('10 stitches x 12 rows - stockinette').should('be.visible');
    });

    it('removes gauge swatch when clicking delete button', () => {
      cy.contains('h3', 'Gauge swatch').parent().find('button[aria-label="Add gauge swatch"]').click();
      
      cy.get('.fixed.inset-0').within(() => {
        cy.get('input').eq(0).type('20', { force: true });
        cy.get('input').eq(1).type('24', { force: true });
        cy.contains('button', 'Save').click();
      });

      cy.contains('20 stitches x 24 rows').parent().find('button').click();
      cy.contains('20 stitches x 24 rows').should('not.exist');
    });
  });

  describe('Size Management', () => {
    it('opens modal when clicking add size button', () => {
      cy.contains('h3', 'Size').parent().find('button[aria-label="Add size"]').click();
      cy.contains('h2', 'Add size').should('be.visible');
    });

    it('adds a size', () => {
      cy.contains('h3', 'Size').parent().find('button[aria-label="Add size"]').click();
      
      cy.get('.fixed.inset-0').within(() => {
        cy.get('input').last().type('Medium');
      });
      cy.get('.fixed.inset-0').within(() => {
        cy.contains('button', 'Save').click();
      });

      cy.contains('Medium').should('be.visible');
    });

    it('disables add button after adding one size', () => {
      cy.contains('h3', 'Size').parent().find('button[aria-label="Add size"]').click();
      cy.get('.fixed.inset-0').within(() => {
        cy.get('input').last().type('Large');
        cy.contains('button', 'Save').click();
      });

      cy.contains('h3', 'Size').parent().find('button[aria-label="Add size"]')
        .should('have.class', 'opacity-50')
        .and('have.class', 'cursor-not-allowed');
    });
  });

  describe('Measurements', () => {
    it('allows user to enter chest circumference', () => {
      // Find the Chest circumference input by looking at the flex-1 structure
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

    it('adds extra material', () => {
      cy.contains('h3', 'Extra materials').parent().find('button[aria-label="Add extra material"]').click();
      
      cy.get('.fixed.inset-0').within(() => {
        cy.get('input').last().type('Buttons');
      });
      cy.get('.fixed.inset-0').within(() => {
        cy.contains('button', 'Save').click();
      });

      cy.contains('Buttons').should('be.visible');
    });
  });

  describe('Current Position', () => {
    it('allows user to add notes about current position', () => {
      const notes = 'Just finished the ribbing';
      
      cy.get('textarea').type(notes);
      cy.get('textarea').should('have.value', notes);
    });
  });

  describe('Save Functionality', () => {
    it('shows error modal when trying to save without project name', () => {
      cy.contains('button', 'Save Project').click();
      
      cy.contains('Name Required').should('be.visible');
      cy.contains('Please enter a name for your WIP').should('be.visible');
      
      cy.contains('button', 'OK').click();
      cy.contains('Name Required').should('not.exist');
    });

    it('saves project with complete information', () => {
      cy.intercept('POST', '/api/wips', {
        statusCode: 200,
        body: { wipID: 123, wipName: 'Test Project' }
      }).as('createWIP');

      cy.intercept('POST', '/api/needles', {
        statusCode: 200,
        body: { success: true }
      }).as('saveNeedles');

      cy.get('input#boardTitle').type('Test Sweater');
      
      cy.contains('h3', 'Needles').parent().find('button[aria-label="Add needle"]').click();
      cy.get('input').eq(0).type('4.0mm');
      cy.get('input').eq(1).type('Body');
      cy.contains('button', 'Save').click();

      cy.get('input[placeholder="Add some comments here"]').type('My first project');

      cy.contains('button', 'Save Project').click();
      cy.contains('button', 'Is saving...').should('be.visible');

      cy.wait('@createWIP');
      cy.wait('@saveNeedles');
    });
  });

  describe('Back Navigation', () => {
    it('navigates back immediately when no changes made', () => {
      cy.contains('button', 'Back').click();
      cy.location('pathname').should('eq', '/create');
    });

    it('shows confirmation modal when changes exist', () => {
      cy.get('input#boardTitle').type('Some Project');
      cy.contains('button', 'Back').click();
      
      cy.contains('Are you sure you want to leave?').should('be.visible');
    });

    it('cancels back navigation when clicking No', () => {
      cy.get('input#boardTitle').type('Test');
      cy.contains('button', 'Back').click();
      
      cy.get('.fixed.inset-0').within(() => {
        cy.contains('button', 'No').click();
      });
      
      cy.contains('Are you sure you want to leave?').should('not.exist');
    });

    it('confirms back navigation when clicking Yes', () => {
      cy.get('input#boardTitle').type('Test');
      cy.contains('button', 'Back').click();
      
      cy.get('.fixed.inset-0').within(() => {
        cy.contains('button', 'Yes').click();
      });
      
      cy.location('pathname').should('eq', '/create');
    });
  });
});