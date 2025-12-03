declare namespace Cypress {
  interface Chainable {
    loginAndGetToken(): Chainable<string>;
    loginAndGetUserId(): Chainable<string>;
  }
}
