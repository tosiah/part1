import {useEffect, useState} from 'react'
import personsService from './services/persons'

const Search = ({searchPhrase, onChangeHandler}) => {
    return <div>search: <input value={searchPhrase} onChange={onChangeHandler}/></div>
}

const Notification = ({name}) => {
    const notificationStyle = {
        color: 'green',
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        background: 'lightgrey',
        fontSize: 20
    }
    return name !== null ? <div style={notificationStyle}>Added {name}</div> : null
}

const ErrorNotification = ({name}) => {
    const notificationStyle = {
        color: 'red',
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        background: 'lightgrey',
        fontSize: 20
    }
    return name !== null ? <div style={notificationStyle}>{name} was already removed from the server</div> : null
}


const PersonDetails = ({name, phoneNumber, onClickHandler}) => {
    return <div>{name} {phoneNumber}
        <button onClick={onClickHandler}>delete</button>
    </div>
}

const Persons = ({personsList, handlePersonDeletion}) => {
    return <div>{personsList.map((person) => <PersonDetails key={person.id} name={person.name}
                                                            phoneNumber={person.phoneNumber}
                                                            onClickHandler={() => handlePersonDeletion(person.name, person.id)}/>)}</div>
}


const Form = ({name, phoneNumber, onChangeNameHandler, onChangePhoneNumberHandler, onSubmitHandler}) => {
    return (
        <form>
            <div>
                name: <input value={name} onChange={onChangeNameHandler}/>
            </div>
            <div>phone number: <input value={phoneNumber} onChange={onChangePhoneNumberHandler}/></div>
            <div>
                <button type="submit" onClick={onSubmitHandler}>add</button>
            </div>
        </form>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])

    useEffect(() => {
        console.log('effect')
        personsService.getAll()
            .then((returnedData) => {
                setPersons(returnedData)
            })
    }, [])

    const [newName, setNewName] = useState('')
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [searchPhrase, setSearchPhrase] = useState('')
    const [nameForNotification, setNameForNotification] = useState(null)
    const [nameForErrorNotification, setNameForErrorNotification] = useState(null)

    const handlePersonDeletion = (name, id) => {
        if(window.confirm(`Do you want to remove person ${name}?`)) {
            personsService.remove(id)
                .then(() => setPersons(persons.filter((p) => p.id !== id)))
        }
    }

    const showNotification = (name) => {
        setNameForNotification(name)
        setTimeout(() => setNameForNotification(null), 5000)
    }

    const showErrorNotification = (name) => {
        setNameForErrorNotification(name)
        setTimeout(() => setNameForErrorNotification(null), 5000)
    }

    const handlePersonAddition = (event) => {
        const phoneNumberRegex = "^[\\d*#+]+$";

        event.preventDefault()
        if (persons.some((person) => person.name === newName)) {
            console.log(`name is already added`)
            if(window.confirm(`${newName} is already added to phonebook, do you want to replace the old number with the new one?`)){
                const personToEdit = persons.find((person) => {
                    console.log(`personName: ${person.name === newName}`)
                    return person.name === newName
                })
                personsService.update(personToEdit.id, {...personToEdit, phoneNumber: newPhoneNumber})
                        .then((returnedData)=> {
                            setPersons(persons.map((p) => p.id !== personToEdit.id ? p : returnedData))
                            showNotification(newName)
                        })
                .catch((err) => {
                    showErrorNotification(newName)
                    setPersons(persons.filter((p) => p.id !== personToEdit.id ))
                })
            }
        }
        else if (newName.trim() === '' || newPhoneNumber.trim() === '') {
            window.alert(`Neither name nor phone number can be empty`);
        }
        else if (!newPhoneNumber.match(phoneNumberRegex)) {
            window.alert(`Phone number includes forbidden signs`);
        }
        else{
            personsService.create({name: newName, phoneNumber: newPhoneNumber})
                .then((returnedPerson) => setPersons([...persons, returnedPerson])
                )
            showNotification(newName);
            setNewName('');
            setNewPhoneNumber('');
        }
    }


    const personsToShow = () => persons.filter((person) => person.name.toLowerCase().includes(searchPhrase) || person.phoneNumber.includes(searchPhrase))

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification name = {nameForNotification}/>
            <ErrorNotification name = {nameForErrorNotification}/>
            <div>debug: {newName}</div>
            <Search searchPhrase={searchPhrase}
                    onChangeHandler={(event) => setSearchPhrase(event.target.value)}/>
            <Form name={newName} phoneNumber={newPhoneNumber}
                  onChangeNameHandler={(event) => setNewName(event.target.value)}
                  onChangePhoneNumberHandler={(event) => setNewPhoneNumber(event.target.value)}
                  onSubmitHandler={handlePersonAddition}>
            </Form>
            <h2>Numbers</h2>
            <div>
                <Persons personsList={personsToShow()} handlePersonDeletion={handlePersonDeletion}/>
            </div>
        </div>
    )
}

export default App