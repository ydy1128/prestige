import axios from 'axios';
import {
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE
} from './ActionTypes';

//===============AUTHENTICATION===============

// Login
export function loginRequest(username, password, url_ref) {
    return (dispatch) => {
        // inform that Login API is initiating
        dispatch(login());
        let post_url = '/api/' + url_ref + '/signin'
        // API Request
        return axios.post(post_url, { username, password })
        .then((response) => {
            // Success
            dispatch(loginSuccess(username));
        })
        .catch((error) => {
            // Fail
            dispatch(loginFailure());
        });
    };
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}

export function loginSuccess(username) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        username
    };
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

//Register
export function registerRequest(username, password, name, url_ref) {
    return (dispatch) => {
        // inform that Login API is initiating
        dispatch(register());
        console.log(url_ref, '3')

        let post_url = '/api/' + url_ref + '/signup'

        return axios.post(post_url, { username, password, name })
        .then((response) => {
            //success
            dispatch(registerSuccess());
        })
        .catch((error) => {
            //fail
            dispatch(registerFailure(error.response.data.code));
        });
    };
}

export function register() {
    return {
        type: AUTH_REGISTER
    };
}

export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS,
    };
}

export function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error
    };
}