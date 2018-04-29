import axios from 'axios';
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
    AUTH_UPDATE,
    AUTH_UPDATE_SUCCESS,
    AUTH_UPDATE_FAILURE,
    AUTH_LOGOUT
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
            console.log('login: ', response.data)
            dispatch(loginSuccess(response.data.id));
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
            dispatch(registerFailure(error.response.data));
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
            console.log('getStatus: ', response.data.info)
            dispatch(getStatusSuccess(response.data.info));
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

//update
export function updateUserRequest(obj, url_ref) {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(updateUser());

        let get_url = '/api/' + url_ref + '/updateinfo'

        return axios.put(get_url, {obj})
        .then((response) => {
            console.log('updateUser: ', response.data.account)
            dispatch(updateUserSuccess(response.data.account));
        })
        .catch((error) => {
            dispatch(updateUserFailure(error.response.data));
        });
    };

}

export function updateUser() {
    return {
        type: AUTH_UPDATE
    };
}

export function updateUserSuccess(user) {
    return {
        type: AUTH_UPDATE_SUCCESS,
        user
    };
}

export function updateUserFailure(error) {
    return {
        type: AUTH_UPDATE_FAILURE,
        error: error
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
