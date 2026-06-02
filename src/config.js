const isLocal = window.location.hostname === 'localhost'
export const API_BASE_URL = isLocal 
  ? 'http://localhost:3001'
  : 'https://helix-production-accd.up.railway.app'
export default API_BASE_URL
