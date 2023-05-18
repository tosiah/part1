import { useState, useEffect } from 'react'
import Notes from './components/Notes'
import noteService from './services/notes'
import Notification from "./components/Notification";
import Footer from "./components/Footer";

const App = () => {
    const [notes, setNotes] = useState(null)
    const [newNote, setNewNote] = useState(
        'a new note...'
    )
    const [showAll, setShowAll] = useState(false)
    const [errorMessage, setErrorMessage] = useState('some error happened...')

    useEffect(() => {
        noteService.getAll()
            .then(initialData => {
                console.log('promise fulfilled')
                setNotes(initialData)
            })
    }, [])

    const addNote = (event) => {
        event.preventDefault()

        const noteObject = {
            content: newNote,
            important: Math.random() > 0.5
        }

        noteService.create(noteObject)
            .then(returnedNote => {
                console.log(returnedNote)
                setNotes(notes.concat([returnedNote]));
                cleanInput()
            })
    }

    const notesToShow = () => {
        if(showAll){
            return notes
        }
        else {
            return notes ? notes.filter((note) => note.important) : null
        }
    }

    const toggleShowAllNotesState = () => setShowAll(!showAll)

    const cleanInput = () => setNewNote('a new note...')

    const handleNoteChange = (event) => {
        console.log(event.target.value)
        setNewNote(event.target.value)
    }

    const toggleImportanceOf = (id) => {
        const note = notes.find((n) => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService.update(id, changedNote)
            .then((returnedNote) => {
            setNotes(notes.map((n) => n.id !== id ? n : returnedNote))
        })
            .catch((error) => {
                setErrorMessage(`the note '${note.content}' was already deleted from server`)
                setTimeout(() => setErrorMessage(null), 5000)
                setNotes(notes.filter((n) => n.id !== id))
            })
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}></Notification>
            <Notes notes = {notesToShow()} toggleImportance={toggleImportanceOf}></Notes>
            <button onClick={toggleShowAllNotesState}>Showing all notes: {showAll.toString()}</button>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </form>
            <Footer></Footer>
        </div>
    )
}

export default App