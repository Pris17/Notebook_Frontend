import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import * as api from "../api";

const PrivateRoute = ({ location, path, component, username, exact }) => {

    const [showHome, setShowHome] = React.useState(typeof username === "string" && username.trim().length === 0);

    if (showHome) {
        return <Redirect to={{
            pathname: "/",
            state: {
                from: location.pathname
            }
        }} />;
    }
    else {
        return <Route exact={exact} path={path} component={component} />;
    }
};

export default connect(
    ({ username }) => ({ username }),
    (dispatch) => ({
        setUserNameRedux: (name) => dispatch({ type: "USER_NAME", payload: name })
    })
)(PrivateRoute);

