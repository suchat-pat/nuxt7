import axios from 'axios'
const api = 'http://localhost:3001/api/auth'
export default { login : (data) => axios.post(`${api}`,data) }