import { createSlice } from "@reduxjs/toolkit";



const authSlice = createSlice({

    name: "auth",
    initialState: {
        updateinfo: {
            isFetching: false,
            error: false,

        },
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        },



        msg: ""
    },
    reducers: {


        updateInfoStart: (state) => {
            state.updateinfo.isFetching = true;
        },

        updateInfoFailed: (state) => {
            state.updateinfo.isFetching = false;
            state.updateinfo.error = true;

        },
        loginStart: (state) => {
            state.login.isFetching = true;

        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;

        },
        loginFailed: (state, action) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.msg = action.payload
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;

            state.login.error = false;
        },
        logOutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logOutStart: (state) => {
            state.login.isFetching = true;
        },

    }
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
    updateInfoStart,
    updateInfoFailed,



} = authSlice.actions;

export default authSlice.reducer;

