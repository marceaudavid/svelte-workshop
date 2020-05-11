const URL = 'backend.cleverapps.io';
const PROTOCOL = location.protocol;
const WS_PROTOCOL = PROTOCOL === 'https:' ? 'wss:' : 'ws:';
const API = `${PROTOCOL}//${URL}`;
const WS = `${WS_PROTOCOL}//${URL}`;

/**
 *
 * @param {string} ticket
 * @param {CallableFunction} onMessage
 * @param {CallableFunction} onClose
 */
async function startWebsocket(ticket, onMessage, onClose) {
  const ws = new WebSocket(WS);
  return new Promise((resolve) =>
    ws.addEventListener('open', () => {
      ws.send(ticket);
      ws.addEventListener('message', onMessage);
      ws.addEventListener('close', onClose);
      resolve(ws);
    })
  );
}

/**
 * Request to logout to the logout endpoint
 * @returns {Promise} Fetch response object
 */
async function logout() {
  return fetch(`${API}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

/**
 * Request to login to the login endpoint
 * @param {string} username
 * @param {string} password
 * @returns {Promise} Fetch response object
 */
async function signIn(username, password) {
  return fetch(`${API}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

/**
 * Request to signup to the subscribe endpoint
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @returns {Promise} Fetch response object
 */
async function signUp(username, password, email) {
  return fetch(`${API}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      email,
    }),
  });
}

/**
 * Request the auth status from the status endpoint
 * @returns {Promise} Fetch response object
 */
async function getStatus() {
  return fetch(`${API}/status`, {
    credentials: 'include',
  });
}

/**
 * Request a ticket from the wsTicket endpoint
 * @returns {Promise} Fetch response object
 */
async function getTicket() {
  return fetch(`${API}/wsTicket`, {
    credentials: 'include',
  });
}

export default { startWebsocket, logout, signIn, signUp, getStatus, getTicket };
