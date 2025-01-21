export default function authenticate(username, password) {
  const validUsername = 'admin';
  const validPassword = '12345';

  if (username === validUsername && password === validPassword) {
    return true;
  }
  return false;
}