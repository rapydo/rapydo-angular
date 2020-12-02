// type can be:
//  0 = a super simple password with only a repeated len times
//  1 = only lower case letters
//  2 = lower and uppert case letters
//  3 = letters and numbers
//  4 = everything, symbols included
export function getpassword(type, len = 0) {
  if (len == 0) len = Cypress.env("AUTH_MIN_PASSWORD_LENGTH");

  if (type <= 0) {
    return "a".repeat(len);
  }

  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = ".,+-_!£$%=^";

  let characters = lower;

  if (type >= 2) characters += upper;
  if (type >= 3) characters += numbers;
  if (type >= 4) characters += symbols;

  let pwd = "";

  for (let i = 0; i < len; i++) {
    pwd += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return pwd;
}
