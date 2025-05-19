export interface HttpError extends Error {
  status?: number;
  message: string;
}

export function getData<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(`Failed to load data from ${url}`);
  });
}

export async function postData<T>(url: string, data: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  }

  let message = `Failed to load data from ${url}`;

  try {
    const errorData = await response.json();

    if (errorData?.message) {
      message = errorData.message;
    }
  } catch {}

  const error = new Error(message) as HttpError;
  error.status = response.status;
  throw error;
}

export async function postDataWithToken<T>(url: string, data: unknown, token: string): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  }

  let message = `Failed to load data from ${url}`;

  try {
    const errorData = await response.json();
    if (errorData?.message) {
      message = errorData.message;
    }
  } catch {}

  const error = new Error(message) as HttpError;
  error.status = response.status;
  throw error;
}

export async function deleteData<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (response.ok) {
    return response.json();
  }

  let message = `Failed to delete data from ${url}`;

  try {
    const errorData = await response.json();
    if (errorData?.message) {
      message = errorData.message;
    }
  } catch {}

  const error = new Error(message) as HttpError;
  error.status = response.status;
  throw error;
}

export async function updateData<T>(url: string, data: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  }

  let message = `Failed to update data on ${url}`;

  try {
    const errorData = await response.json();
    if (errorData?.message) {
      message = errorData.message;
    }
  } catch {}

  const error = new Error(message) as HttpError;
  error.status = response.status;
  throw error;
}
