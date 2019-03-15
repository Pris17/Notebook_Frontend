import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:1900",
});

const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (token === null || token === void (0)) {
        throw new Error("Auth token missing");
    }
    else {
        return token;
    }
};

const getUserName = () => {
    const token = getAuthToken();
    let parsedToken = atob(token.split(".")[1]);
    parsedToken = JSON.parse(parsedToken);

    return parsedToken.sub;
};

export const register = (name, username, email, password) => {
    return api.post(
        "/users/sign-up",
        { name, username, email, password }
    );
    // return Promise.resolve({ data: null });
};

export const login = (username, password) => {
    return api.post(
        "/login",
        { username, password }
    ).then((response) => {
        const token = response.headers["authorization"];
        localStorage.setItem("authToken", token);
        return getUserName(token);
    });
    // return Promise.resolve("pris");
};

export const validate = () => {
    try {
        const token = getAuthToken();

        return api.get("/users/validate", {
            headers: {
                "Authorization": token
            }
        }).then(() => {
            const name = getUserName();            
            return name;
        });
    }
    catch (ex) {
        return Promise.reject(ex);
    }
    // return Promise.resolve("pris");
};

export const getNotes = (username) => {
    try {
        const token = getAuthToken();
        console.log(`Api call for ${username}`);
        return api.get(`/notebook?username=${username}`, {
            headers: {
                "Authorization": token
            }
        });
    }
    catch (ex) {
        return Promise.reject(ex);
    }
    // return Promise.resolve({ data: notes });
};

export const addNote = (username, title, description) => {
    try {
        const token = getAuthToken();        
        return api.post(`/notebook/user/${username}`, [
            {
                title,
                description
            }
        ],
            {
                headers: {
                    "Authorization": token
                }
            });
    }
    catch (ex) {
        return Promise.reject(ex);
    }
    // notes.push({
    //     id: Math.random(),
    //     title,
    //     description,
    //     creationTime: new Date().toISOString(),
    //     updateTime: new Date().toISOString()
    // });
    // return Promise.resolve({ data: null });
};

export const deleteNote = (noteId) => {
    try {
        const token = getAuthToken();

        return api.delete(`/notebook/${noteId}`,
            {
                headers: {
                    "Authorization": token
                }
            });
    }
    catch (ex) {
        return Promise.reject(ex);
    }
    // notes = notes.filter(d => d !== noteId);
    // return Promise.resolve({ data: null });
};

export const editNote = (noteId, description) => {
    try {
        const token = getAuthToken();

        return api.put(`/notebook/${noteId}`,
            {
                description
            },
            {
                headers: {
                    "Authorization": token
                }
            });
    }
    catch (ex) {
        return Promise.reject(ex);
    }
    // notes = notes.map(d => {
    //     return d.id === noteId ? {
    //         ...d,
    //         description
    //     } : d;
    // });
    // return Promise.resolve({ data: null });
};
