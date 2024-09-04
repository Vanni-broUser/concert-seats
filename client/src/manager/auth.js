export const login = async (username, password) => {
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const logout = async () => {
  const response = await fetch('/logout', {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
};
