describe('Pattern Queue API', () => {
  const baseUrl = '/api/patternQueue';
  it('Should create a pattern successfully', () => {
    cy.loginAndGetUserId().then((userId) => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          patternName: "Cool Pattern",
          patternLink: "http://example.com/pattern",
          patternPosition: 1
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('patternName', 'Cool Pattern');
        expect(res.body).to.have.property('patternLink', 'http://example.com/pattern');
        expect(res.body).to.have.property('patternPosition', 1);
        expect(res.body).to.have.property('userID', userId);
      });
    });
  });

  it('Should fail if patternName is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        patternLink: "http://example.com/pattern",
        patternPosition: 1
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Pattern name, link and position are required');
    });
  });

  it('Should fail if patternLink is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        patternName: "Cool Pattern",
        patternPosition: 1
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Pattern name, link and position are required');
    });
  });

  it('Should fail if patternPosition is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        patternName: "Cool Pattern",
        patternLink: "http://example.com/pattern"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Pattern name, link and position are required');
    });
  });

  it('Should fail when unauthorized (no login)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        patternName: "Cool Pattern",
        patternLink: "http://example.com/pattern",
        patternPosition: 1
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
        patternName: "Cool Pattern",
        patternLink: "http://example.com/pattern",
        patternPosition: { invalid: true }
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(500);
      expect(res.body.error).to.eq('Failed to create pattern');
    });
  });

});
