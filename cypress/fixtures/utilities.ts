// This is to silence ESLint about undefined Cypress
/*global cy, Cypress*/

function generatePassword(
  length: number,
  useUppercase: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:',.<>/?";

  let password = [];

  let charset = lowercase;
  password.push(lowercase.charAt(Math.floor(Math.random() * lowercase.length)));

  if (useUppercase) {
    charset += uppercase;
    password.push(
      uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
    );
  }
  if (useNumbers) {
    charset += numbers;
    password.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
  }
  if (useSymbols) {
    charset += symbols;
    password.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
  }

  if (charset === "") {
    throw new Error("At least one character type should be selected");
  }

  for (let i = password.length, n = charset.length; i < length; ++i) {
    password.push(charset.charAt(Math.floor(Math.random() * n)));
  }

  // Shuffle the password array
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]]; // Swap
  }

  return password.join("");
}

// type can be:
//  1 = only lower case letters
//  2 = lower and uppert case letters
//  3 = letters and numbers
//  4 = everything, symbols included
export function getpassword(type, len = 0) {
  if (len === 0) {
    len = Cypress.env("AUTH_MIN_PASSWORD_LENGTH");
  }

  return generatePassword(len, type >= 2, type >= 3, type >= 4);
}

export function get_random_username(prefix: string) {
  const randval = generatePassword(16, false, false, false);
  return `${prefix}_${randval}@sample.org`;
}

export function get_totp() {
  return "111111";
}
