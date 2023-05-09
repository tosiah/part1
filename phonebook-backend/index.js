const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('res-body', (request) => request.method === 'POST' ? JSON.stringify(request.body) : '')

app.use(morgan(':method :url :status :res-body :response-time'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)
    const requestedPerson = persons.find(p => p.id === personId)
    if(!requestedPerson){
        return response.status(404).end()
    }
    response.json(requestedPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)
    const personToDelete = persons.find(p => p.id === personId)
    if(personToDelete){
        persons = persons.filter(p => p.id !== personId)
        response.status(204).end()
    } else{
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const newId = Math.floor((Math.random()*1000))
    if(!request.body.name || !request.body.number){
        return response.status(400).json(`Name and number must be given for a new person in a phonebook`)
    }
    if(persons.find(p => p.name === request.body.name)){
        return response.status(400).json(`Name must be unique`)
    }
    const newPerson = ({
        id: newId,
        name: request.body.name,
        number: request.body.number
    })
    persons = [...persons, newPerson]
    response.json(newPerson)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date().toUTCString()}</p>`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)