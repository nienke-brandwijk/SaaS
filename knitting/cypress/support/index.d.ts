declare namespace Cypress {
  interface Chainable {
    loginAndGetToken(): Chainable<string>;
  }
}
