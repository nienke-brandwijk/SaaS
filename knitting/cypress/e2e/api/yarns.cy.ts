describe('Yarn API', () => {
  const baseUrl = '/api/yarns';
  it('Should create yarn successfully with valid data', () => {
    cy.loginAndGetUserId().then(() => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          yarnName: "Soft Wool",
          yarnProducer: "YarnCo",
          wipID: 37
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('yarnName', 'Soft Wool');
        expect(res.body).to.have.property('yarnProducer', 'YarnCo');
        expect(res.body).to.have.property('wipID', 37);
      });
    });
  });

  it('Should fail if yarnName is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        yarnProducer: "YarnCo",
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Yarn name, producer and WIP ID are required');
    });
  });

  it('Should fail if yarnProducer is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        yarnName: "Soft Wool",
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Yarn name, producer and WIP ID are required');
    });
  });

  it('Should fail if wipID is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        yarnName: "Soft Wool",
        yarnProducer: "YarnCo"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Yarn name, producer and WIP ID are required');
    });
  });

  it('Should fail when unauthorized (no login)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        yarnName: "Soft Wool",
        yarnProducer: "YarnCo",
        wipID: 37
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.error).to.eq('Unauthorized');
    });
  });

  it('Should fail with 400 if the controller throws an error', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        yarnName: { invalid: true },
        yarnProducer: "YarnCo",
        wipID: null
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Yarn name, producer and WIP ID are required');
    });
  });

  it('Should fail when unauthorized', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/123`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('error', 'Unauthorized');
    });
  });

  it('Should fail with 500 when controller throws an error', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/not-a-number`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(500);
      expect(res.body).to.have.property('error', 'Failed to delete yarn');
    });
  });

  it('Should fail with 405 when deleteWIPYarn throws internally', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(405);
    });
  });
});
