import axios from 'axios'
const API_ROOT_PATH = 'https://www.bungie.net/Platform'
const API_KEY = process.env.API_KEY

async function makeRequest (id, token) {
  const config = {
    headers: {
      'X-API-Key': API_KEY,
      Authorization: `Bearer ${token}`
    }
  }
  let response = null
  try {
    response = await axios.get(`${API_ROOT_PATH}/User/GetBungieNetUserById/${id}/`, config)
  } catch (error) {
    console.error(error)
  }
  if (response !== null) {
    console.log(`got response: ${response.data}`)
  } else {
    console.error('Could not get info')
    return null
  }
}

export default makeRequest
