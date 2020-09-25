export function getCookie(cookieName) {
  let cookieArr = document.cookie.split('; ')
                                 .map(cookie => cookie.split('='));
  
  for (let i = 0; i < cookieArr.length; i++) {
    const cookie = cookieArr[i];
    if (cookie[0] == cookieName) {
      return cookie[1];
    }
  }

  return '';
}