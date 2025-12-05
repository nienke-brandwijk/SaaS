describe('WIPs API', () => {
  const baseUrl = '/api/wips';
  const baseUrl2     = '/api/wips/from-pattern';
  it('Should create a new WIP successfully with valid data', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        wipName: 'Test WIP',
        wipPictureURL: 'https://mkgmhleloqcaikelvzmy.supabase.co/storage/v1/object/public/knittingImages/dagmarsweatermanhjelholt4-01-kopi_1500x1500.webp',
        wipBoardID: null,
        wipFinished: false,
        wipCurrentPosition: 'left shoulder',
        wipSize: 'M',
        wipChestCircumference: 95,
        wipEase: 5,
        userID: 'b4b4730b-2765-4a6c-8422-42874f8d06f7'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('wipName', 'Test WIP');
      expect(response.body).to.have.property('userID', 'b4b4730b-2765-4a6c-8422-42874f8d06f7');
    });
  });

  it('Should fail if wipName is missing', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        wipPictureURL: 'http://example.com/image.jpg',
        userID: 'user123'
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'wip name and userID are required');
    });
  });

  it('Should fail if userID is missing', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        wipName: 'Missing user test'
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'wip name and userID are required');
    });
  });

  it('Should fail with 500 if server throws an error', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {
        wipName: 'Will break server',
        userID: 'user123',
        wipChestCircumference: { invalid: "object shouldn't be here" }
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body).to.have.property('error', 'Failed to create WIP');
    });
  });
  /*
  it('Should create a new WIP from pattern successfully', () => {
    cy.loginAndGetUserId().then((userId) => {
      
      cy.request({
        method: 'POST',
        url: baseUrl2,
        body: {
          patternName: "Cool Pattern",
          patternQueueID: "18"
        }
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('wipName', "Cool Pattern");
        expect(res.body).to.have.property('userID', userId);
      });

    });
  });*/

  it('Should fail if missing patternName', () => {
    cy.loginAndGetUserId();

    cy.request({
      method: 'POST',
      url: baseUrl2,
      body: {
        patternQueueID: "queue123"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('error', 'Pattern name and queue ID are required');
    });
  });

  it('Should fail if missing patternQueueID', () => {
    cy.loginAndGetUserId();

    cy.request({
      method: 'POST',
      url: baseUrl2,
      body: {
        patternName: "Cool Pattern"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('error', 'Pattern name and queue ID are required');
    });
  });

  it('Should fail when unauthorized (no login)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl2,
      body: {
        patternName: "Cool Pattern",
        patternQueueID: "queue123"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('error', 'Unauthorized');
    });
  });

  it('Should fail with 500 if controller throws an error', () => {
    cy.loginAndGetUserId();

    cy.request({
      method: 'POST',
      url: baseUrl2,
      body: {
        patternName: {},
        patternQueueID: "queue123"
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(500);
      expect(res.body).to.have.property('error', 'Failed to create WIP from pattern');
    });
  });

});
