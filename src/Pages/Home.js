import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as api from "../api";

const styles = {
    SideBar: {
        height: "100vh",
        backgroundColor: "#424242"
    },
    Form: {
        boxShadow: "0 0 1px black",
        padding: "30px"
    },
    Alert: {
        padding: "10px 20px",
        borderRadius: "4px",
        marginTop: "20px",
        border: "1px solid #c2c2c2",
        borderRaduis: "6px",
        boxShadow: "1px 1px 1.5px #cfcfcf",
        transition: "opacity 1s"
    },
    AlertError: {
        backgroundColor: "red",
        color: "white",
    },
    Input: {
        marginTop: "20px"
    }
};

const Home = ({ setUserNameRedux, location }) => {
    const [form, setForm] = React.useState("Login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showNotesHome, setShowNotesHome] = React.useState(false);
    const [registeredMessage, setRegisteredMessage] = React.useState(false);
    const errorState = React.useState({ className: "", message: "", opacity: 0 });

    const setLoginError = () => {
        errorState[1]({
            style: "AlertError",
            message: "Login Failed",
            opacity: 1
        });
        setTimeout(() => {
            errorState[1]({
                style: "",
                message: "Login Failed",
                opacity: 0
            });
        }, 2000);
    };

    const setRegisterError = () => {
        errorState[1]({
            style: "AlertError",
            message: "Register Failed",
            opacity: 1
        });
        setTimeout(() => {
            errorState[1]({
                style: "",
                message: "Register Failed",
                opacity: 0
            });
        }, 2000);
    };

    React.useEffect(() => {
        setRegisteredMessage(false);
        let unmounted = false;
        if (!unmounted) {
            api.validate().then(
                (username) => {
                    setUserNameRedux(username);
                    const t = !unmounted ? setShowNotesHome(true) : null;
                },
                error => {
                    console.log(error);
                }
            );
        }
        return () => unmounted = true;
    }, []);

    const handleRegister = (event) => {
        event.preventDefault();
        setForm(form === "Register" ? "Login" : "Register");
    };

    const handleLogin = (event) => {
        event.preventDefault();
        setUserNameRedux(userName)
        if (form === "Login") {
            api.login(userName, password)
                .then(
                    (username) => {
                        setUserNameRedux(username);
                        setShowNotesHome(true)
                    },
                    setLoginError
                );
        }
        else {
            api.register(name, userName, email, password)
                .then(
                    () => {
                        setRegisteredMessage(true);
                        setForm("Login");
                    },
                    setRegisterError
                );
        }
    };

    if (showNotesHome) {
        let redirectPath = "/notes";
        if (location.state && location.state.from) {
            redirectPath = location.state.from;
        }
        return <Redirect to={redirectPath} />;
    }
    else {
        return (
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 hidden-xs" style={styles.SideBar}>
                            <div style={{ marginTop: "250px", color: "white" }}>
                                <p style={{ fontSize: "20px" }} >Wander Notes</p>
                                <p>Your personalised notebook manager</p>
                            </div>
                        </div>
                        <div className="col-sm-8 col-sm-offset-0 col-xs-8 col-xs-offset-2">
                            <div
                                style={styles.Form}
                                className="col-xs-12 col-xs-offset-0 col-sm-6 col-sm-offset-1 my-form"
                            >
                                <h3 className="text-center hidden-sm hidden-md hidden-lg" style={{ padding: "0px", margin: "0", marginBottom: "15px", borderBottom: "3px solid black" }}>Wander Notes</h3>
                                {
                                    form === "Login" ? null : <div className="input-group">
                                        <span className="input-group-addon" id="basic-addon1">
                                            <span className="glyphicon glyphicon-user" />
                                        </span>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="form-control"
                                            placeholder="Name"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>
                                }
                                <div className="input-group" style={styles.Input}>
                                    <span className="input-group-addon" id="basic-addon1">
                                        <span className="glyphicon glyphicon-user" />
                                    </span>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={e => setUserName(e.target.value)}
                                        className="form-control"
                                        placeholder="Username"
                                        aria-describedby="basic-addon1"
                                    />
                                </div>
                                {
                                    form === "Login" ? null : <div className="input-group" style={styles.Input}>
                                        <span className="input-group-addon" id="basic-addon1">
                                            <span className="glyphicon glyphicon-briefcase" />
                                        </span>
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="form-control"
                                            placeholder="Email"
                                            aria-describedby="basic-addon1"
                                        />
                                    </div>
                                }
                                <div className="input-group" style={styles.Input}>
                                    <span className="input-group-addon" id="basic-addon1">
                                        <span className="glyphicon glyphicon-lock" aria-hidden="true" />
                                    </span>
                                    <input
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        aria-describedby="basic-addon1"
                                    />
                                </div>
                                <div className="input-group" style={{ width: "100%", marginTop: "25px" }}>
                                    <button className="btn btn-success btn-block" onClick={handleLogin}>{
                                        form === "Login" ? "Login" : "Register"
                                    }</button>
                                </div>
                                <div className="input-group" style={{ width: "100%", marginTop: "15px" }}>
                                    <button className="btn btn-primary btn-block" onClick={handleRegister}>{
                                        form !== "Login" ? "Login" : "Register"
                                    }</button>
                                </div>
                            </div>
                            <div className="col-xs-12">
                                <div
                                    className="col-xs-6 col-xs-offset-1 col-sm-4 col-sm-offset-1"
                                    style={
                                        Object.assign(
                                            {
                                                opacity: errorState[0].opacity
                                            },
                                            styles.Alert,
                                            styles.AlertError)
                                    }>
                                    {errorState[0].message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default connect(
    null,
    (dispatch) => ({
        setUserNameRedux: (name) => dispatch({ type: "USER_NAME", payload: name })
    })
)(Home);
