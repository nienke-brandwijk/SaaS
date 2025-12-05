describe('Needle API', () => {
  const baseUrl = '/api/needles';
  it('Should create a needle successfully with valid data', () => {
    cy.loginAndGetUserId().then(() => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          needleSize: 5,
          needlePart: "Circular",
          wipID: 37
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('needleSize', 5);
        expect(res.body).to.have.property('needlePart', 'Circular');
        expect(res.body).to.have.property('wipID', 37);
      });
    });
  });

  it('Should fail if needleSize is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        needlePart: "Circular",
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Needle size, part, and WIP ID are required');
    });
  });

  it('Should fail if needlePart is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        needleSize: "4.0mm",
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Needle size, part, and WIP ID are required');
    });
  });

  it('Should fail if wipID is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        needleSize: "4.0mm",
        needlePart: "Circular"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Needle size, part, and WIP ID are required');
    });
  });

  it('Should fail when unauthorized (no login)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        needleSize: "4.0mm",
        needlePart: "Circular",
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.error).to.eq('Unauthorized');
    });
  });

  it('Should fail with 500 if controller throws an error', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        needleSize: { bad: true },
        needlePart: "Circular",
        wipID: "test-wip-123"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(500);
      expect(res.body.error).to.eq('Failed to create needle');
    });
  });

});
