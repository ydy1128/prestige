import axios from 'axios';
import Toast from 'react-native-simple-toast';
import ipaddress from './ipconfig'
import {
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT
} from './ActionTypes';

//===============AUTHENTICATION===============

// Login
export function loginRequest(username, password) {
    return (dispatch) => {
        // inform that Login API is initiating
        Toast.show('' + username + ' ' + password);
        dispatch(login());
        let post_url = ipaddress + '/api/student/signin'
        // API Request
        return axios.post(post_url, { username, password })
        .then((response) => {
            // Success
            console.log(response.data)
            dispatch(loginSuccess(response.data.id));
        })
        .catch((error) => {
            // Fail
            console.log(error);
            Toast.show(''+error);
            dispatch(loginFailure());

        });
    };
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}

export function loginSuccess(id) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        id
    };
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

//Register
export function registerRequest(username, password, name, school, level, url_ref) {
    return (dispatch) => {
        // inform that Login API is initiating
        dispatch(register());
        console.log(url_ref, '3')

        let post_url = '/api/' + url_ref + '/signup'

        return axios.post(post_url, { username, password, name, school, level })
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

//Session
export function getStatusRequest(url_ref) {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(getStatus());

        let get_url = '/api/' + url_ref + '/getInfo'

        return axios.get(get_url)
        .then((response) => {
            dispatch(getStatusSuccess(response.data.info.username));
        })
        .catch((error) => {
            dispatch(getStatusFailure());
        });
    };

}

export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}

export function getStatusSuccess(username) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        username
    };
}

export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}

//Logout
export function logoutRequest(url_ref) {
    let post_url = '/api/' + url_ref + '/logout';
    return (dispatch) => {
        return axios.post(post_url)
        .then((response) => {
            dispatch(logout());
        });
    };
}

export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}
