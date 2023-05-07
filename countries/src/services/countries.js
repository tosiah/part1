import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1/all'
const baseWeatherUrl = 'http://api.weatherapi.com/v1/current.json'
const api_key = process.env.REACT_APP_API_KEY

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => {
        return response.data
    })
}

const getWeather = (capital) => {
  const request = axios.get(`${baseWeatherUrl}?key=${api_key}&q=${capital}`)

    return request.then((response) => {
        console.log({r: response.data})
        return response.data
    })
}

export default {
    getAll,
    getWeather
}
