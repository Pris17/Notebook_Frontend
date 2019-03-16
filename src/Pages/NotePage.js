import React from "react";
import Note from "../components/Note";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as api from "../api";

const NavigationBar = ({ username, onLogout }) => {
  return (
    <nav
      className="navbar navbar-default navbar-fixed-top navbar-inverse"
      style={{ height: "80px" }}
    >
      <div className="container-fluid">
        <div className="navbar-header">
          <span className="navbar-brand">
            <span
              className="glyphicon glyphicon-grain"
              style={{ fontSize: "30px", color: "white" }}
            />
          </span>
          <span style={{ fontSize: "20px", color: "white", display: "inline-block", paddingTop: "20px"}}>Notebook</span>
        </div>
        {/** <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-5"> */}
        <span
          className="navbar-text navbar-right"
          style={{ marginRight: "10px" }}>
          Signed in as {username} | <span className="navbar-link" onClick={onLogout}>logout</span>
        </span>
      </div>
    </nav>
  );
};

const SideBar = ({ onNoteAdd, onNoteDelete }) => {
  return (
    <div className="hidden-xs col-sm-2">
      <button
        type="button"
        style={{
          borderRadius: "8px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          padding: "10px 20px"
        }}
        onClick={onNoteAdd}
      >
        <span style={{ marginLeft: "6px" }}>Add Note</span>
      </button>
      <br />
      <button
        type="button"
        style={{
          borderRadius: "8px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "10px 20px"
        }}
        onClick={onNoteDelete}
      >
        Delete Note
      </button>
    </div>
  );
};

const NotePage = ({
  username,
  addNote,
  notes: Notes,
  updateNote,
  deleteNote
}) => {
  const [pageNew, setPageNew] = React.useState(false);
  const [pageEdit, setPageEdit] = React.useState(false);
  const [pageHome, setPageHome] = React.useState(false);
  const [noteId, setNoteId] = React.useState(null);
  const [selectedNotes, setSelectedNotes] = React.useState([]);

  React.useEffect(() => {
    api.getNotes(username).then(data => addNote(data.data));
  }, []);

  const logout = () => {
    localStorage.clear();
    setPageHome(true);
  };

  const handleNoteSelect = id => {
    const note = Notes.filter(data => data.id === id);
    if (note.length > 0) {
      const isSelected = note[0].selected;
      const newSelections = selectedNotes.slice();
      if (isSelected) {
        newSelections.splice(newSelections.indexOf(id), 1);
      } else {
        // eslint-disable-next-line no-unused-expressions
        newSelections.indexOf(id) === -1 ? newSelections.push(id) : null;
      }
      console.log(newSelections);
      setSelectedNotes(newSelections);
      updateNote({ ...note[0], selected: !isSelected });
    }
  };

  const handleNew = () => {
    setPageNew(true);
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

  const handleDelete = id => {
    if (typeof id === "number") {
      api.deleteNote(id).then(() => {
        deleteNote(id);
      });
    } else {
      const allPromise = [];
      const allIds = selectedNotes.slice();
      allIds.forEach(d => {
        allPromise.push(api.deleteNote(d));
      });

      Promise.all(allPromise).then(() => {
        allIds.forEach(d => deleteNote(d));
        setSelectedNotes([]);
      });
    }
  };

  const handleEdit = id => {
    setPageEdit(true);
    setNoteId(id);
  };

  const [note, setNote] = React.useState({
    title: "",
    description: "",
    creationTime: "",
    updateTime: ""
  });
  if (pageHome) {
    return (
      <Redirect
        to={{
          pathname: "/",
          state: { id: noteId }
        }}
      />
    );
  } else if (pageEdit) {
    return (
      <Redirect
        to={{
          pathname: "/notes/edit",
          state: { id: noteId }
        }}
      />
    );
  } else if (pageNew) {
    return <Redirect to="/notes/create" />;
  } else {
    return (
      <React.Fragment>
        <NavigationBar onLogout={logout} username={username} />
        <div className="container-fluid" style={{ marginTop: "100px" }}>
          <div className="row">
            <SideBar onNoteAdd={handleNew} onNoteDelete={handleDelete} />
            <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-0">
              <div className="row">
                {getNotes().map((notesArray, i1) => {
                  return (
                    <div className="row" key={i1}>
                      {notesArray.map((data, key) => (
                        <Note
                          key={key}
                          {...data}
                          onSelect={handleNoteSelect}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onView={note => setNote(note)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="myModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  {note.title}
                </h4>
              </div>
              <div className="modal-body">{note.description}</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
};

export default connect(
  state => ({ notes: state.notes, username: state.username }),
  dispatch => ({
    deleteNote: (...ids) => {
      ids.forEach(id => {
        dispatch({ type: "DELETE_NOTE", payload: id });
      });
    },
    updateNote: data => {
      dispatch({ type: "UPDATE_NOTE", payload: data });
    },
    addNote: data => {
      dispatch({ type: "INITIAL_NOTE", payload: data });
    }
  })
)(NotePage);

