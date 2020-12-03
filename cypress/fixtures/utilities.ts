// type can be:
//  0 = a super simple password with only a repeated len times
//  1 = only lower case letters
//  2 = lower and uppert case letters
//  3 = letters and numbers
//  4 = everything, symbols included
export function getpassword(type, len = 0) {
  if (len === 0) {
    len = Cypress.env("AUTH_MIN_PASSWORD_LENGTH");
  }

  if (type <= 0) {
    return "a".repeat(len);
  }

  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = ".,+-_!£$%=^";

  let characters = lower;

  let pwd = "";

  let missing_lower = true;
  let missing_upper = false;
  let missing_numbers = false;
  let missing_symbols = false;

  if (type >= 2) {
    characters += upper;
    missing_upper = true;
  }
  if (type >= 3) {
    characters += numbers;
    missing_numbers = true;
  }
  if (type >= 4) {
    characters += symbols;
    missing_symbols = true;
  }

  for (let i = 0; i < len; i++) {
    const c = characters.charAt(Math.floor(Math.random() * characters.length));
    if (missing_lower && lower.indexOf(c) >= 0) {
      missing_lower = false;
    }
    if (missing_upper && upper.indexOf(c) >= 0) {
      missing_upper = false;
    }
    if (missing_numbers && numbers.indexOf(c) >= 0) {
      missing_numbers = false;
    }
    if (missing_symbols && symbols.indexOf(c) >= 0) {
      missing_symbols = false;
    }
    pwd += c;
  }

  // Some type of characters is missing in the generated password
  // Let's resample it again
  if (missing_symbols || missing_upper || missing_numbers || missing_symbols) {
    return getpassword(type, len);
  }
  return pwd;
}
