import React from "react";

const dateFormatter = (_dte) => {
    const dte = new Date(_dte);
    return dte.getDate() + "-" + (dte.getMonth() + 1) + "-" + dte.getFullYear()
};

export default ({ id, title, description, creationTime, updateTime, onEdit, onDelete, onSelect, selected }) => {

    return (
        <div className="col-xs-8 col-xs-offset-2 col-sm-3 col-sm-offset-0">
            <div className={`note ${selected ? "note-checked" : ""}`}>
                <span className={`glyphicon my-glyphicon glyphicon-${selected ? "check" : "unchecked"}`} style={{ position: "absolute", right: "20px", top: "10px" }} aria-hidden="true" onClick={() => onSelect(id)} />
                <h3>{title}</h3>
                <span>Created On: {dateFormatter(creationTime)}</span>
                <hr />
                <p style={{
                    height: "30px",
                    overflow: "hidden"
                }}>{description}</p>
                <span>Last updated on: {dateFormatter(updateTime)}</span>
                <div className={`${selected ? "invisible" : ""}`} style={{ borderTop: "1px solid #c2c2c2" }}>
                    <span className="glyphicon my-glyphicon glyphicon-pencil" aria-hidden="true" onClick={() => onEdit(id)}>
                        Edit
                    </span>
                    <span className="glyphicon my-glyphicon glyphicon-trash" aria-hidden="true" onClick={() => onDelete(id)}>
                        Delete
                    </span>
                </div>

            </div>
        </div>
    );
};