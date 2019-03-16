import React from "react";

const styles = {
  note: {
    margin: "10px",
    padding: "20px",
    overflow: "auto",
    backgroundColor: "white",
    boxShadow: "0 0 1px #424242"
  },
  noteHead: {
    borderBottom: "2px solid #c2c2c2",
    paddingBottom: "15px"
  },
  noteDescription: {
    padding: "5px",
    paddingBottom: "10px",
    height: "100px",
    overflow: "hidden"
  },
  separator: {
    width: "100%",
    margin: "10px 0",
    height: "1px",
    backgroundColor: "#bcbcbc"
  },
  actions: {}
};

export default ({
  title,
  description,
  onView,
  onEdit,
  onSelect,
  onDelete,
  selected,
  creationTime,
  updateTime,
  id
}) => {
  return (
    <div
      className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-0"
      style={{ overflow: "auto" }}
    >
      <div className="note" style={styles.note}>
        <h3 className="note-head" style={styles.noteHead}>
          <span
            className={`glyphicon ${
              !selected ? "glyphicon-unchecked" : "glyphicon-check"
            }`}
            style={{ fontSize: "16px" }} onClick={() => {onSelect(id)}}
          />{" "}
          {title}
        </h3>
        <span>CREATED: {creationTime}</span>
        <br />
        <span>UPDATED: {updateTime}</span>
        <p style={styles.noteDescription}>{description}</p>
        <div style={styles.separator} />
        <div style={styles.actions}>
          <div
            className="btn-group btn-group-justified"
            role="group"
            aria-label="..."
          >
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-default">
                <span
                  className="glyphicon glyphicon-pencil"
                  onClick={() => {
                    onEdit(id);
                  }}
                />
              </button>
            </div>
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-default">
                <span
                  className="glyphicon glyphicon-trash"
                  onClick={() => {
                    onDelete(id);
                  }}
                />
              </button>
            </div>
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-default"
                data-toggle="modal"
                data-target="#myModal"
                onClick={() => {
                  onView({ title, description });
                }}
              >
                <span className="glyphicon glyphicon-eye-open" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

