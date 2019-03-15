import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as api from "../api";

const CreateNote = ({ addNote, username }) => {
    const [cancel, setCancel] = React.useState(false);
    const noteTitle = React.useRef(null);
    const noteDescription = React.useRef(null);

    const handleNoteCreate = () => {
        api.addNote(username, noteTitle.current.value, noteDescription.current.value)
            .then(
                () => {
                    // addNote(noteTitle.current.value, noteDescription.current.value);
                    setCancel(true);
                },
                (error) => {
                    console.log(error);
                }
            )
        // setCancel(true);
    };

    const handleCancel = () => {
        noteTitle.current.value = "";
        noteDescription.current.value = "";
        setCancel(true);
    };

    if (cancel) {
        return <Redirect to="/notes" />;
    }
    else {
        return <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-sm-6 col-sm-offset-3">
                        <h3>Create a Note</h3>
                        <hr />
                        <div className="form-group">
                            <label htmlFor="txtTitle">Title</label>
                            <input type="text" ref={noteTitle} className="form-control" id="txtTitle" placeholder="Enter the title of the note" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="txtDescription">Description</label>
                            <textarea className="form-control" ref={noteDescription} id="txtDescription" rows="3"></textarea>
                        </div>
                        <button type="button" className="btn btn-default" onClick={handleNoteCreate}>Create</button>
                        <button type="button" className="btn btn-default" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
};

export default connect(
    ({ username }) => ({ username }),
    (dispatch) => ({
        addNote: (title, description) => {
            dispatch({ type: "ADD_NOTE", payload: { id: 4, title, description } });
        }
    })
)(CreateNote);
