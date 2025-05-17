export function getData<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`Failed to load data from ${url}`);
  });
}

export function postData<T>(url: string, data: unknown): Promise<T> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`Failed to load data from ${url}`);
  });
}

export function postDataWithToken<T>(url: string, data: unknown, token: string): Promise<T> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorisation: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`Failed to load data from ${url}`);
  });
}

export function deleteData<T>(url: string): Promise<T> {
  return fetch(url, {
    method: 'DELETE',
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`Failed to delete data at ${url}`);
  });
}

export function updateData<T>(url: string, data: unknown): Promise<T> {
  return fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`Failed to update data at ${url}`);
  });
}
