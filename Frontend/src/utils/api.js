const DEFAULT_TIMEOUT_MS = 10000; // 10s
const DEFAULT_RETRIES = 1;

const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000';

function timeoutPromise(ms) {
  return new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('Request timed out'));
    }, ms);
  });
}

async function fetchWithTimeout(resource, options = {}, timeout = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    fetch(resource, options),
    timeoutPromise(timeout),
  ]);
}

async function request(path, { method = 'GET', body, headers = {}, token, timeout = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES } = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const finalHeaders = {
    'Accept': 'application/json',
    ...headers,
  };
  if (body && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    finalHeaders['x-auth-token'] = token;
  }

  let attempt = 0;
  let lastError;
  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, {
        method,
        headers: finalHeaders,
        body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
        credentials: 'omit',
      }, timeout);

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json().catch(() => ({})) : await response.text();

      if (!response.ok) {
        const message = (isJson && data?.message) ? data.message : `HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      lastError = err;
      // Retry only on network/timeouts/5xx
      const retriable = err.message?.includes('timed out') || !err.status || (err.status >= 500 && err.status < 600);
      if (!retriable || attempt === retries) break;
      attempt += 1;
    }
  }
  throw lastError || new Error('Network error');
}

export const api = {
  get: (path, opts) => request(path, { method: 'GET', ...opts }),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts) => request(path, { method: 'PUT', body, ...opts }),
  del: (path, opts) => request(path, { method: 'DELETE', ...opts }),
  BASE_URL,
};
