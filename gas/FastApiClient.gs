/**
 * HTTPS client for FastAPI backends.
 * Set Script Property FASTAPI_BASE_URL (e.g. https://api.example.com).
 * Set FASTAPI_BEARER_TOKEN for Authorization header when required.
 */

var FASTAPI_MAX_ATTEMPTS = 3;

function fetchFastApi_(path, options) {
  const base = getConfig_('FASTAPI_BASE_URL').replace(/\/$/, '');
  const url = base + (path.startsWith('/') ? path : '/' + path);
  const token = PropertiesService.getScriptProperties().getProperty('FASTAPI_BEARER_TOKEN');

  const fetchOptions = options || {};
  const headers = fetchOptions.headers || {};
  if (token) headers.Authorization = 'Bearer ' + token;
  fetchOptions.headers = headers;
  fetchOptions.muteHttpExceptions = true;
  if (fetchOptions.method === undefined) fetchOptions.method = 'get';

  let lastError = null;
  for (let attempt = 1; attempt <= FASTAPI_MAX_ATTEMPTS; attempt++) {
    const response = UrlFetchApp.fetch(url, fetchOptions);
    const code = response.getResponseCode();
    if (code >= 200 && code < 300) {
      const text = response.getContentText();
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    }
    lastError = 'HTTP ' + code + ' from ' + url;
    if (code >= 400 && code < 500 && code !== 429) break;
    Utilities.sleep(Math.min(1000 * Math.pow(2, attempt - 1), 8000));
  }
  throw new Error(lastError || 'FastAPI request failed');
}

/** Example: POST sales total to backend (enable only after server auth is configured). */
function postSalesTotalToFastApi_(total) {
  return fetchFastApi_('/api/v1/sales-snapshot', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ total: total, capturedAt: new Date().toISOString() }),
  });
}
