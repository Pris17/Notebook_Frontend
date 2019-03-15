import React from "react";
import Note from "../components/Note";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as api from "../api";

/**
 * 
 * @param {Date} dte 
 */


const NotePage = ({ notes: Notes, deleteNote, updateNote, username, addNote }) => {
    const [ pageNew, setPageNew ] = React.useState(false);
    const [ pageEdit, setPageEdit ] = React.useState(false);
    const [ pageHome, setPageHome ] = React.useState(false);
    const [ noteId, setNoteId  ] = React.useState(null);        
    const [selectedNotes, setSelectedNotes] = React.useState([]);

    React.useEffect(() => {
        api.getNotes(username)
            .then((data) => addNote(data.data));
    }, []);

    const handleNoteSelect = (id) => {
        const note = Notes.filter((data) => data.id === id);
        if (note.length > 0) {
            const isSelected = note[0].selected;
            const newSelections = selectedNotes.slice();
            if(isSelected){
                newSelections.splice(newSelections.indexOf(id), 1);
            }
            else{
                // eslint-disable-next-line no-unused-expressions
                newSelections.indexOf(id) === -1 ? newSelections.push(id) : null;
            }
            setSelectedNotes(newSelections);
            updateNote({ ...note[0], selected: !isSelected });
        }
    };

    const handleNew = () => {
        setPageNew(true);
    };

    const handleDelete = (id) => {
        if (typeof id === "number") {
            api.deleteNote(id).then(() => {
                deleteNote(id);
            });
        }
        else {
            const allPromise = [];
            const allIds = selectedNotes.slice();
            allIds.forEach((d) => {
                allPromise.push(api.deleteNote(d));
            });

            Promise.all(allPromise).then(() => {
                allIds.forEach(d => deleteNote(d));
                setSelectedNotes([])
            });
            
        }
    };

    const handleEdit = (id) => {
        setPageEdit(true);
        setNoteId(id)
    };

    const getNotes = () => {
        const NotesIn4 = [];
        let startingIndex = 0;
        for (let i = 0; i < Notes.length; i++) {
            if ((i + 1) / 4 === 0) {
                startingIndex++;
            }
            if (!NotesIn4[startingIndex]) {
                NotesIn4[startingIndex] = [];
            }
            NotesIn4[startingIndex].push(Notes[i]);
        }
        return NotesIn4;
    };

    if(pageHome){
        return <Redirect to={{
            pathname: "/",
            state: { id: noteId }
        }} />;
    }
    else if (pageEdit) {
        return <Redirect to={{
            pathname: "/notes/edit",
            state: { id: noteId }
        }} />;
    }
    else if (pageNew) {
        return <Redirect to="/notes/create" />;
    }
    else {
        return <React.Fragment>            
            <div className="container-fluid">
                <div className="row" style={{ height: "100px", padding: "10px 0", boxShadow: "0 0 1px black" }}>
                    <div className="col-xs-6"><h1>Welcome {username}</h1></div>
                    <div className="col-xs-6 text-right">
                        <button type="button" className="btn btn-default" style={{ marginTop: "20px", backgroundColor: "black", color: "white" }} onClick={() => {
                            localStorage.clear();
                            setPageHome(true);                            
                        }}>
                            Logout
                        </button>
                    </div>
                </div>
                <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-xs-2">
                        <button style={{
                            padding: "10px 20px",
                            border: "none",
                            margin: "10px",
                            backgroundColor: "#03739e",
                            borderRadius: "20px",
                            color: "white"
                        }} onClick={handleNew}>Add Note</button>

                        {
                            selectedNotes.length < 1 ? null : <button style={{
                                padding: "10px 20px",
                                border: "none",
                                backgroundColor: "red",
                                borderRadius: "20px",
                                color: "white"
                            }} onClick={handleDelete}>Delete {selectedNotes.length === 1 ? "Note" : "Notes"}</button>
                        }
                    </div>
                    <div className="col-xs-10">
                        <div className="row">
                            {
                                getNotes().map((notesArray, i1) => {
                                    return <div className="row" key={i1}>
                                        {
                                            notesArray.map((data, key) => (
                                                <Note
                                                    key={key}
                                                    {...data}
                                                    onSelect={handleNoteSelect}
                                                    onDelete={handleDelete}
                                                    onEdit={handleEdit}
                                                />
                                            ))
                                        }
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>


                {/* <div className="row">
                    <div className="col-xs-3">
                        <button type="button" className="btn btn-default" onClick={() => setDisplayCreatePage(true)}>
                            New Note
                        </button>
                    </div>
                    <div className="col-xs-9">
                        {notes.map((d, k) => <Note {...d} key={k} onEdit={handleEdit} />)}
                    </div>
                </div> */}
            </div>
        </React.Fragment>;
    }
};

export default connect(
    (state) => ({ notes: state.notes, username: state.username }),
    (dispatch) => ({
        deleteNote: (...ids) => {
            ids.forEach(id => {
                dispatch({ type: "DELETE_NOTE", payload: id });
            })
        },
        updateNote: (data) => {
            dispatch({ type: "UPDATE_NOTE", payload: data });
        },
        addNote: (data) => {
            dispatch({ type: "INITIAL_NOTE", payload: data });
        }
    })
)(NotePage)