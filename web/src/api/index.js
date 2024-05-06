import axios from 'axios'

const appRequest = axios.create({
  baseURL: 'http://localhost:3333/api/',
  timeout: 1000 * 20,
})

appRequest.interceptors.response.use((response) => {
  let result = response.data

  if (result && result.js) {
    if (!window[result.export]) {
      const s = document.createElement('script')
      s.innerHTML = `${result.js}`
      s.async = false
      document.body.append(s)
    }
    result = window[result.export](result.data)
  }

  if (result && result.error) {
    alert(result.error)
    throw new Error(result.error)
  }

  return result
})

const GET = (url, data, config) => {
  return appRequest({
    url,
    params: data,
    method: 'GET',
    ...config,
  })
}
const POST = (url, data, config) => {
  return appRequest({
    url,
    data,
    method: 'POST',
    ...config,
  })
}

export const api = {
  get(action, data, config) {
    return GET(action, data, config)
  },
  post(action, data, config) {
    return POST(action, data, config)
  },
}
