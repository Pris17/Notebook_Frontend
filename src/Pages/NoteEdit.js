import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as api from "../api";

const EditNote = ({ location, updateNote, notes }) => {
    const [homePage, setHomePage] = React.useState(false);
    const [noteId, setNoteId] = React.useState(null);
    const noteTitle = React.useRef(null);
    const noteDescription = React.useRef(null);

    React.useEffect(() => {    
        if(location.state && location.state.id){
            setNoteId(location.state.id);

            const note = notes.filter((data) => {            
                return data.id === location.state.id;
            });
            if(noteTitle.current !== null && noteDescription.current !== null){
                noteTitle.current.value = note[0].title;
                noteDescription.current.value = note[0].description;
            }   
        }
        else{
            setHomePage(true);
        }
    });

    const goToHome = () => setHomePage(true);

    const handleUpdate = () => {
        api.editNote(noteId, noteDescription.current.value)
            .then(
                () => {
                    goToHome();
                },
                error => {
                    console.log(error);
                }
            )
        // updateNote(noteId, noteTitle.current.value, noteDescription.current.value);
    };

    if (homePage) {
        return <Redirect to="/notes" />;
    }
    else {
        return <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-6 col-sm-offset-3">
                        <h3>Edit a Note</h3>
                        <hr />
                        <div className="form-group">
                            <label htmlFor="txtTitle">Title</label>
                            <input type="text" readOnly={true} className="form-control" id="txtTitle" placeholder="Enter the title of the note" ref={noteTitle} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="txtDescription">Description</label>
                            <textarea className="form-control" id="txtDescription" rows="3" ref={noteDescription}></textarea>
                        </div>
                        <button type="button" className="btn btn-default" onClick={handleUpdate}>Update</button>
                        <button type="button" className="btn btn-default" onClick={goToHome}>Cancel</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

export default connect(
    (state) => ({
        notes: state.notes
    }),
    (dispatch) => ({
        updateNote: (noteId, noteTitle, noteDescription) => {
            dispatch({
                type: "UPDATE_NOTE", payload: {
                    id: noteId,
                    title: noteTitle,
                    description: noteDescription
                }
            });
        }
    })
)(EditNote);