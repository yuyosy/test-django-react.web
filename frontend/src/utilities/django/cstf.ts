// This code is a modified version of the example code from django-allauth.
// https://github.com/pennersr/django-allauth/blob/main/examples/react-spa/frontend/src/lib/django.js

const getCookie = (name: string) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
export const getCSRFToken = (key: string = 'csrftoken') => {
  return getCookie(key);
};
