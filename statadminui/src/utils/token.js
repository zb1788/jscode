export function getAccessToken () {
  try {
    return JSON.parse(decodeURIComponent(localStorage.getItem('auth_token'))) || '';
  } catch (e) {
    return '';
  }
}
