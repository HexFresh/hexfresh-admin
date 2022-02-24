export function pending() {
  return { type: 'ui/pending' };
}

export function success() {
  return { type: 'ui/success' };
}

export function showError(message) {
  return { type: 'ui/error', message };
}
