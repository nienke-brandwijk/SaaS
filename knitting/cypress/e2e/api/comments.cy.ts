describe('WIP Comments API', () => {
  const baseUrl = '/api/comments';
  it('Should create a comment successfully', () => {
    cy.loginAndGetUserId().then(() => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          commentContent: "This is a test comment",
          wipID: 37
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('commentContent', 'This is a test comment');
        expect(res.body).to.have.property('wipID', 37);
      });
    });
  });

  it('Should fail if commentContent is missing', () => {
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
      expect(res.body.error).to.eq('Comment content and WIP ID are required');
    });
  });

  it('Should fail if wipID is missing', () => {
    cy.loginAndGetUserId();
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        commentContent: "This is a test comment"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Comment content and WIP ID are required');
    });
  });

  it('Should fail when unauthorized (no login)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        commentContent: "This is a test comment",
        wipID: 37
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
        commentContent: { invalid: true },
        wipID: null
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq('Comment content and WIP ID are required');
    });
  });

});
