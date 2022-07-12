const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res.status);
  }
}

const baseUrl = 'https://auth.nomoreparties.co';

const signUp = (password, email) => {
  const requestUrl = baseUrl + '/signup';
  return fetch(requestUrl, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ password, email }),
  }).then(checkResponse);
}

const signIn = (password, email) => {
  const requestUrl = baseUrl + '/signin';
  return fetch(requestUrl, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ password, email }),
  }).then(checkResponse);
}

const getToken = (jwt) => {
  const requestUrl = baseUrl + '/users/me';
  return fetch(requestUrl, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  }).then(checkResponse);
}
