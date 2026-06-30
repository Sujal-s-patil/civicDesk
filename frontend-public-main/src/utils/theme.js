export function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return;
  }

  document.body.classList.toggle('dark-theme', theme === 'dark');
  localStorage.setItem('theme', theme);
}

export function getPreferredTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
}
