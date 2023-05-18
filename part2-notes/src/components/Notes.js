import Note from "./Note";

const Notes = ({ notes, toggleImportance }) => {
    if(notes){
        console.log(`notesssssss: ${notes.length}`)
        return (<div>
            <ul>
                {notes.map(note => {
                        console.log(`note: ${note.id} ${note.content}`)
                        return <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)}/>
                    }
                )}
            </ul>
        </div>)
    }
    else{
        return null
    }
}

export default Notes