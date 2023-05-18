require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


morgan.token('res-body', (request) => request.method === 'POST' ? JSON.stringify(request.body) : '')

app.use(morgan(':method :url :status :res-body :response-time'))

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })


app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then((foundPerson) => {
        if(foundPerson){
            return response.json(foundPerson)
        } else{
            return response.status(404).end();
        }
    }).catch((err) => next(err))
})

// app.get('/api/persons/:id', (request, response) => {
//     const personId = Number(request.params.id)
//     const requestedPerson = persons.find(p => p.id === personId)
//     if(!requestedPerson){
//         return response.status(404).end()
//     }
//     response.json(requestedPerson)
// })

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then((personToDelete) => {
        if(personToDelete){
            return response.status(204).end()
        } else{
            return response.status(404).end()
        }
    }).catch((err) => next(err))
})

// app.delete('/api/persons/:id', (request, response) => {
//     const personId = Number(request.params.id)
//     const personToDelete = persons.find(p => p.id === personId)
//     if(personToDelete){
//         persons = persons.filter(p => p.id !== personId)
//         response.status(204).end()
//     } else{
//         response.status(404).end()
//     }
// })


app.post('/api/persons', (request, response, next) => {
    if(!request.body.name || !request.body.phoneNumber){
        return response.status(400).json(`Name and phoneNumber must be given for a new person in a phonebook`)
    }

    Person.find({name: request.body.name}).then((peopleWithGivenName) => {
        console.log({peopleWithGivenName})
        if(peopleWithGivenName.length > 0){
            console.log(`not unique name`)
            return response.status(400).json(`Name must be unique`).end()
        } else{
            const newPerson = new Person({
                name: request.body.name,
                phoneNumber: request.body.phoneNumber
            })
            return newPerson.save().then((savedPerson) => response.json(savedPerson))

        }
    }).catch((err) => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {phoneNumber} = request.body
    const person = {
        phoneNumber
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'}).then((updatedPerson ) => {
        console.log(`findByIdAndUpdate`)
        response.json(updatedPerson)
        }
    ).catch((err) => {
        console.log(err.response.data.error)
        next(err)
    })
})

// app.post('/api/persons', (request, response) => {
//     const newId = Math.floor((Math.random()*1000))
//     if(!request.body.name || !request.body.phoneNumber){
//         return response.status(400).json(`Name and phoneNumber must be given for a new person in a phonebook`)
//     }
//     if(persons.find(p => p.name === request.body.name)){
//         return response.status(400).json(`Name must be unique`)
//     }
//     const newPerson = ({
//         id: newId,
//         name: request.body.name,
//         phoneNumber: request.body.phoneNumber
//     })
//     persons = [...persons, newPerson]
//     response.json(newPerson)
// })


// app.get('/info', (request, response) => {
//     response.send(`<p>Phonebook has info for ${persons.length} people</p>
// <p>${new Date().toUTCString()}</p>`)
// })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.log(`---------------`)
    console.log(error.name)


    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: 'phoneNumber and name must have at least 3 signs' })
    } else if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)