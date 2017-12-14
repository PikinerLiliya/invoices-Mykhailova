const defaultOptions = {
  credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
};

export function request(url, options) {
  url = `http://localhost:8000${url}`;

  return fetch(url, options);
}

export function httpOptions(options) {
  const params = Object.assign({}, defaultOptions, options);

  return params;
}

export function checkStatus(response) {
  if (response.ok) {
    return response;
  }

  return response.json().then((error) => {
    throw error;
  });

}