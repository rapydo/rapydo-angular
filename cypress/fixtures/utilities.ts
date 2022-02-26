// This is to silence ESLint about undefined Cypress
/*global cy, Cypress*/

import * as generator from "generate-password-browser";

// type can be:
//  1 = only lower case letters
//  2 = lower and uppert case letters
//  3 = letters and numbers
//  4 = everything, symbols included
export function getpassword(type, len = 0) {
  if (len === 0) {
    len = Cypress.env("AUTH_MIN_PASSWORD_LENGTH");
  }

  const password = generator.generate({
    length: len,
    lowercase: true,
    uppercase: type >= 2,
    numbers: type >= 3,
    symbols: type >= 4,
    excludeSimilarCharacters: false,
    strict: true,
  });

  return password;
}

export function get_random_username(prefix: string) {
  const randval = generator.generate({
    length: 16,
    lowercase: true,
    uppercase: false,
    numbers: false,
    symbols: false,
    excludeSimilarCharacters: false,
    strict: false,
  });

  return `${prefix}_${randval}@sample.org`;
}

import * as OTPAuth from "otpauth";

const totp = new OTPAuth.TOTP({
  // TESTING_TOTP_HASH is set by setup-cypress github action
  secret: Cypress.env("TESTING_TOTP_HASH"),
  digits: 6,
  period: 30,
});
export function get_totp() {
  return totp.generate();
}
