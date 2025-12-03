describe('Users API', () => {
  it('Should login successfully with valid credentials', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      body: { email: 'ja.ja@ja.com', password: '123456' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('email', 'ja.ja@ja.com');
    });
  });

  it('Should fail login with invalid credentials', () => {
    cy.request({
      method: 'POST',
      url: '/api/login',
      body: { email: 'fout.fout@fout.com', password: '654321' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('errorMessage');
    });
  });

  const baseUrl = '/api/users';
  const testUserId = '670bdcca-ee0e-40f3-bc4b-44dd021bfd26';

  it("Should update user progress", () => {
  cy.loginAndGetToken().then((token) => {
    cy.request({
      method: "PUT",
      url: "/api/users/uppro",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        userId: testUserId,
        progress: 4,
      },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("user");
    });
  });
});

  it('Should fail update if missing fields', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/uppro`,
      body: { userId: testUserId },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  it('Should fail upload if no file provided', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/upima`,
      body: { userId: testUserId },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });
});
