const raw = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const server = raw.endsWith('/') ? raw + 'api/' : raw + '/api/';
export default server;
