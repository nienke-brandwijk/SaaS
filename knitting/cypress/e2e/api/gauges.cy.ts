describe('Gauge Swatch API', () => {
  const baseUrl = '/api/gaugeSwatches';
  it('Should create a gauge swatch successfully with valid data', () => {
    cy.loginAndGetUserId().then(() => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          gaugeStitches: 20,
          gaugeRows: 28,
          gaugeDescription: "Test swatch",
          wipID: 37
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('gaugeStitches', 20);
        expect(res.body).to.have.property('gaugeRows', 28);
        expect(res.body).to.have.property('gaugeDescription', 'Test swatch');
        expect(res.body).to.have.property('wipID', 37);
      });
    });
  });

  it('Should succeed with empty gaugeDescription', () => {
    cy.loginAndGetUserId().then(() => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          gaugeStitches: 18,
          gaugeRows: 24,
          wipID: 37
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('gaugeStitches', 18);
        expect(res.body).to.have.property('gaugeRows', 24);
        expect(res.body).to.have.property('gaugeDescription', '');
        expect(res.body).to.have.property('wipID', 37);
      });
    });
  });

  it('Should fail if gaugeStitches is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        gaugeRows: 28,
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Gauge stitches, rows and WIP ID are required');
    });
  });

  it('Should fail if gaugeRows is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        gaugeStitches: 20,
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Gauge stitches, rows and WIP ID are required');
    });
  });

  it('Should fail if wipID is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        gaugeStitches: 20,
        gaugeRows: 28
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Gauge stitches, rows and WIP ID are required');
    });
  });

  it('Should fail when unauthorized (no login)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        gaugeStitches: 20,
        gaugeRows: 28,
        gaugeDescription: "Test swatch",
        wipID: "test-wip-123"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.error).to.eq('Unauthorized');
    });
  });

  it('Should fail with 400 if controller throws an error', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        gaugeStitches: { bad: true },
        gaugeRows: 28,
        gaugeDescription: "Test",
        wipID: null
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Gauge stitches, rows and WIP ID are required');
    });
  });

});
