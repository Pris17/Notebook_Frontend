import { createStore, applyMiddleware, combineReducers } from "redux";
import { logger } from "redux-logger";

const notereducer = (state = [], action) => {
    switch(action.type){
        case "INITIAL_NOTE":
            return action.payload;
        case "ADD_NOTE":
            const newState = [...state, action.payload];
            return newState;
        case "DELETE_NOTE":
            return state.filter((data) => data.id !== action.payload);
        case "UPDATE_NOTE":
            return state.map((data) => data.id === action.payload.id ? action.payload : data);          
        default:
            return state;
    }
};

const userreducer = (state = "", action) => {
    if(action.type === "USER_NAME"){
        return action.payload;
    }
    else{
        return state;
    }
};

const store = createStore(combineReducers({
    notes: notereducer,
    username: userreducer
}));

export default store;