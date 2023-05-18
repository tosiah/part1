import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
    const request = axios.get(baseUrl)
    const noteNotPresentOnServer = {
        id: 1000,
        content: "This note is not present on server",
        important: true
    }
    return request.then((response) => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then((response) => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then((response) => response.data)
}

export default {
    getAll,
    create,
    update
}
