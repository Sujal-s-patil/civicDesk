export function getStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem('userData');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to parse stored user data', error);
    sessionStorage.removeItem('userData');
    return null;
  }
}

export function setStoredUser(user) {
  sessionStorage.setItem('userData', JSON.stringify(user));
}

export function clearStoredUser() {
  sessionStorage.removeItem('userData');
}
