const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.y8u0xye.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length===3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.phoneNumber}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length===4) {
    console.log('give name as 4th and phoneNumber aas 5th argument')
    process.exit(1)
}

if (process.argv.length===5) {
    const person = new Person({
        name,
        phoneNumber,
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.phoneNumber} to phonebook`)
        mongoose.connection.close()
    })
}