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

      cy.get('button[aria-label="remove picture"]', { timeout: 10000 }).should('be.visible').click();
      cy.get('img').should('not.exist');
      cy.contains('button', 'Upload image').should('be.visible');
    });
  });

  describe('Needles Management', () => {
    it('opens modal when clicking add needle button', () => {
      cy.contains('h3', 'Needles').parent().find('button[aria-label="Add needle"]').click();
      cy.contains('h2', 'Add needle').should('be.visible');
    });

    it('adds a needle with size and part', () => {
      cy.contains('h3', 'Needles').parent().find('button[aria-label="Add needle"]').click();
      
      // Wait for modal and type without chaining
      cy.contains('h2', 'Add needle').should('be.visible');
      
      // Type in first input
      cy.get('input[placeholder="Size needle in mm (e.g., 4.0mm)"]').should('be.visible').type('4.0mm');
      
      // Wait a bit for React to settle, then type in second input
      cy.wait(100);
      cy.get('input[placeholder="Section using this needle (e.g., Body, Sleeves)"]').should('be.visible').type('Body');
      
      // Click save
      cy.contains('button', 'Save').click();

      cy.contains('4.0mm - Body').should('be.visible');
    });

    it('removes a needle when clicking delete button', () => {
      cy.contains('h3', 'Needles').parent().find('button[aria-label="Add needle"]').click();
      
      cy.contains('h2', 'Add needle').should('be.visible');
      cy.get('input[placeholder="Size needle in mm (e.g., 4.0mm)"]').should('be.visible').type('5.0mm');
      cy.wait(100);
      cy.get('input[placeholder="Section using this needle (e.g., Body, Sleeves)"]').should('be.visible').type('Sleeves');
      cy.contains('button', 'Save').click();

      cy.contains('5.0mm - Sleeves').should('be.visible');
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
      
      cy.contains('h2', 'Add yarn').should('be.visible');
      cy.get('input[placeholder="Yarn name (e.g., Cozy Wool)"]').should('be.visible').type('Cozy Wool');
      cy.wait(100);
      cy.get('input[placeholder="yarn producer (e.g., YarnCo)"]').should('be.visible').type('YarnCo');
      cy.contains('button', 'Save').click();

      cy.contains('Cozy Wool by YarnCo').should('be.visible');
    });

    it('removes yarn when clicking delete button', () => {
      // First add a yarn
      cy.contains('h3', 'Yarn').parent().find('button[aria-label="Add yarn"]').click();
      
      cy.contains('h2', 'Add yarn').should('be.visible');
      cy.get('input[placeholder="Yarn name (e.g., Cozy Wool)"]').should('be.visible').type('Cozy Wool');
      cy.wait(100);
      cy.get('input[placeholder="yarn producer (e.g., YarnCo)"]').should('be.visible').type('YarnCo');
      cy.contains('button', 'Save').click();

      // Then remove it
      cy.contains('Cozy Wool by YarnCo').should('be.visible');
      cy.contains('Cozy Wool by YarnCo').parent().find('button').click();
      cy.contains('Cozy Wool by YarnCo').should('not.exist');
    });
  });

  describe('Gauge Swatch Management', () => {
    it('opens modal when clicking add gauge swatch button', () => {
      cy.contains('h3', 'Gauge swatch').parent().find('button[aria-label="Add gauge swatch"]').click();
      cy.contains('h2', 'Add gauge swatch').should('be.visible');
    });

    it('adds gauge swatch with stitches and rows', () => {
      cy.contains('h3', 'Gauge swatch').parent().find('button[aria-label="Add gauge swatch"]').click();
      
      cy.contains('h2', 'Add gauge swatch').should('be.visible');
      cy.get('input[placeholder="Stitches"]').should('be.visible').type('10');
      cy.wait(100);
      cy.get('input[placeholder="Rows"]').should('be.visible').and('not.be.disabled').type('12');
      cy.wait(100);
      cy.get('input[placeholder="Description (e.g., stockinette stitch, after blocking)"]').should('be.visible').type('stockinette');
      cy.contains('button', 'Save').click();

      cy.contains('10 stitches x 12 rows - stockinette').should('be.visible');
    });

    it('removes gauge swatch when clicking delete button', () => {
      cy.contains('h3', 'Gauge swatch').parent().find('button[aria-label="Add gauge swatch"]').click();
      
      cy.contains('h2', 'Add gauge swatch').should('be.visible');
      cy.get('input[placeholder="Stitches"]').should('be.visible').type('20');
      cy.wait(100);
      cy.get('input[placeholder="Rows"]').should('be.visible').and('not.be.disabled').type('24');
      cy.contains('button', 'Save').click();

      cy.contains('20 stitches x 24 rows').should('be.visible');
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
      
      cy.contains('h2', 'Add size').should('be.visible');
      // Use a more specific selector for the size input
      cy.contains('h2', 'Add size').parent().find('input').first().should('be.visible').type('Medium');
      cy.contains('button', 'Save').click();

      cy.contains('Medium').should('be.visible');
    });

    it('disables add button after adding one size', () => {
      cy.contains('h3', 'Size').parent().find('button[aria-label="Add size"]').click();
      
      cy.contains('h2', 'Add size').should('be.visible');
      cy.contains('h2', 'Add size').parent().find('input').first().should('be.visible').type('Large');
      cy.contains('button', 'Save').click();

      // Wait for modal to close and size to appear
      cy.contains('Large').should('be.visible');
      
      cy.contains('h3', 'Size').parent().find('button[aria-label="Add size"]')
        .should('have.class', 'opacity-50')
        .and('have.class', 'cursor-not-allowed');
    });
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

    it('adds extra material', () => {
      cy.contains('h3', 'Extra materials').parent().find('button[aria-label="Add extra material"]').click();
      
      cy.contains('h2', 'Add extra material').should('be.visible');
      cy.contains('h2', 'Add extra material').parent().find('input').first().should('be.visible').type('Buttons');
      cy.contains('button', 'Save').click();

      cy.contains('Buttons').should('be.visible');
    });
  });

  describe('Current Position', () => {
    it('allows user to add notes about current position', () => {
      // The textarea is in the Current position section
      cy.contains('h3', 'Current position').parent().find('textarea').type('Test');
      cy.contains('h3', 'Current position').parent().find('textarea').should('have.value', 'Test');
    });
  });
});