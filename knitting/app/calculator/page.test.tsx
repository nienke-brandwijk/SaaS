describe.only('Calculator page - basic calculator correctness', () => {
  beforeEach(() => {
    cy.visit('/calculator');
  });

  it('calculates yarn amount correctly and allows save', () => {
    cy.contains('h1', 'Yarn Amount Calculator').closest('.card').within(() => {
      cy.get('input[placeholder="e.g., 500"]').clear().type('500'); // patternGrams
      cy.get('input[placeholder="e.g., 200"]').clear().type('200'); // patternLength
      cy.get('input[placeholder="e.g., 100"]').clear().type('100'); // patternWeight
      cy.get('input[placeholder="e.g., 150"]').clear().type('150'); // yourLength
      cy.get('input[placeholder="e.g., 50"]').clear().type('50');   // yourWeight
      cy.contains('button', 'Calculate').click();
    });

    cy.contains('h3', 'Yarn Amount Result').should('be.visible');
    cy.contains('You need 7 ball(s) of your yarn').should('exist');
    cy.contains('333 grams').should('exist');

    cy.contains('button', 'Save').should('be.disabled');
    cy.get('input[placeholder="e.g., Sweater front panel"]').clear().type('Test yarn calc');
    cy.contains('button', 'Save').should('not.be.disabled').click();

    cy.contains('h3', 'Yarn Amount Result').should('not.exist');
  });

  it('calculates gauge swatch correctly', () => {
    cy.contains('h1', 'Gauge Swatch Calculator').closest('.card').within(() => {
      cy.get('input[placeholder="e.g., 20"]').clear().type('20');   // patternGauge
      cy.get('input[placeholder="e.g., 22"]').clear().type('22');   // yourGauge
      cy.get('input[placeholder="e.g., 100"]').clear().type('100'); // originalStitches
      cy.contains('button', 'Calculate').click();
    });

    cy.contains('h3', 'Gauge Swatch Result').should('be.visible');
    cy.contains('You need to cast on 110 stitches').should('exist');

    cy.contains('button', 'Close').click();
    cy.contains('h3', 'Gauge Swatch Result').should('not.exist');
  });

  it('calculates picked stitches correctly', () => {
    cy.contains('h1', 'Picked Stitches Calculator').closest('.card').within(() => {
      cy.get('input[placeholder="e.g., 18"]').clear().type('18');  // stitchGauge
      cy.get('input[placeholder="e.g., 22"]').clear().type('22');  // rowGauge
      cy.get('input[placeholder="e.g., 40"]').clear().type('40');  // edgeLength
      cy.contains('button', 'Calculate').click();
    });

    cy.contains('h3', 'Picked Stitches Result').should('be.visible');
    cy.contains('72 stitches').should('exist');
    cy.contains('0.82').should('exist');

    cy.contains('button', 'Close').click();
    cy.contains('h3', 'Picked Stitches Result').should('not.exist');
  });

  // Additional tests

  it('calculate buttons are disabled until all required inputs are filled', () => {
    // Yarn
    cy.contains('h1', 'Yarn Amount Calculator').closest('.card').within(() => {
      cy.contains('button', 'Calculate').should('be.disabled');
      cy.get('input[placeholder="e.g., 500"]').type('1');
      cy.get('input[placeholder="e.g., 200"]').type('1');
      cy.get('input[placeholder="e.g., 100"]').type('1');
      cy.get('input[placeholder="e.g., 150"]').type('1');
      cy.get('input[placeholder="e.g., 50"]').type('1');
      cy.contains('button', 'Calculate').should('not.be.disabled');
    });

    // Gauge
    cy.contains('h1', 'Gauge Swatch Calculator').closest('.card').within(() => {
      cy.contains('button', 'Calculate').should('be.disabled');
      cy.get('input[placeholder="e.g., 20"]').type('1');
      cy.get('input[placeholder="e.g., 22"]').type('1');
      cy.get('input[placeholder="e.g., 100"]').type('1');
      cy.contains('button', 'Calculate').should('not.be.disabled');
    });

    // Picked stitches
    cy.contains('h1', 'Picked Stitches Calculator').closest('.card').within(() => {
      cy.contains('button', 'Calculate').should('be.disabled');
      cy.get('input[placeholder="e.g., 18"]').type('1');
      cy.get('input[placeholder="e.g., 22"]').type('1');
      cy.get('input[placeholder="e.g., 40"]').type('1');
      cy.contains('button', 'Calculate').should('not.be.disabled');
    });
  });

  it('yarn calculation with another dataset and closing by backdrop', () => {
    cy.contains('h1', 'Yarn Amount Calculator').closest('.card').within(() => {
      cy.get('input[placeholder="e.g., 500"]').clear().type('250'); // patternGrams
      cy.get('input[placeholder="e.g., 200"]').clear().type('100'); // patternLength
      cy.get('input[placeholder="e.g., 100"]').clear().type('50');  // patternWeight
      cy.get('input[placeholder="e.g., 150"]').clear().type('120'); // yourLength
      cy.get('input[placeholder="e.g., 50"]').clear().type('30');   // yourWeight
      cy.contains('button', 'Calculate').click();
    });

    // metersNeeded = (250/50)*100 = 500
    // ballsNeeded = ceil(500/120) = 5
    // totalWeight = (500/120)*30 ≈ 125
    cy.contains('h3', 'Yarn Amount Result').should('be.visible');
    cy.contains('You need 5 ball(s) of your yarn').should('exist');
    cy.contains('125 grams').should('exist');

    // click backdrop to close
    cy.get('.bg-black.bg-opacity-50').click({ force: true });
    cy.contains('h3', 'Yarn Amount Result').should('not.exist');
  });

  it('gauge swatch allows saving when name provided', () => {
    cy.contains('h1', 'Gauge Swatch Calculator').closest('.card').within(() => {
      cy.get('input[placeholder="e.g., 20"]').clear().type('21');
      cy.get('input[placeholder="e.g., 22"]').clear().type('19');
      cy.get('input[placeholder="e.g., 100"]').clear().type('80');
      cy.contains('button', 'Calculate').click();
    });

    // adjustedStitches = round(80*19/21) = 72
    cy.contains('h3', 'Gauge Swatch Result').should('be.visible');
    cy.contains('You need to cast on 72 stitches').should('exist');

    cy.contains('button', 'Save').should('be.disabled');
    cy.get('input[placeholder="e.g., Sweater front panel"]').clear().type('Gauge test');
    cy.contains('button', 'Save').should('not.be.disabled').click();

    cy.contains('h3', 'Gauge Swatch Result').should('not.exist');
  });

  it('picked stitches calculates decimals and rounds correctly', () => {
    cy.contains('h1', 'Picked Stitches Calculator').closest('.card').within(() => {
      cy.get('input[placeholder="e.g., 18"]').clear().type('18'); // stitchGauge
      cy.get('input[placeholder="e.g., 22"]').clear().type('20'); // rowGauge
      cy.get('input[placeholder="e.g., 40"]').clear().type('45'); // edgeLength
      cy.contains('button', 'Calculate').click();
    });

    // ratio = 18/20 = 0.9
    // totalStitches = 45 * (20/10) * 0.9 = 45 * 2 * 0.9 = 81
    cy.contains('h3', 'Picked Stitches Result').should('be.visible');
    cy.contains('81 stitches').should('exist');
    cy.contains('0.90').should('exist');

    cy.contains('button', 'Close').click();
    cy.contains('h3', 'Picked Stitches Result').should('not.exist');
  });
});