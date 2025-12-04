describe('Extra Materials API', () => {
  const baseUrl = '/api/extraMaterials';
  it('Should create an extra material successfully', () => {
    cy.loginAndGetUserId().then(() => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          extraMaterialsDescription: "Buttons and beads",
          wipID: 37
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('extraMaterialsDescription', 'Buttons and beads');
        expect(res.body).to.have.property('wipID', 37);
      });
    });
  });

  it('Should fail if extraMaterialsDescription is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Description and WIP ID are required');
    });
  });

  it('Should fail if wipID is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        extraMaterialsDescription: "Buttons and beads"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Description and WIP ID are required');
    });
  });

  it('Should fail when unauthorized (no login)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        extraMaterialsDescription: "Buttons and beads",
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
        extraMaterialsDescription: { invalid: true },
        wipID: "test-wip-123"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(500);
      expect(res.body.error).to.eq('Failed to create extra material');
    });
  });

});
