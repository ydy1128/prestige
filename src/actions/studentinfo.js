import {
    GET_STUDENTS_INFO,
    GET_STUDENTS_INFO_SUCCESS,
    GET_STUDENTS_INFO_FAILURE,
    STUDENT_INFO_EDIT,
    STUDENT_INFO_EDIT_SUCCESS,
    STUDENT_INFO_EDIT_FAILURE,
    STUDENT_INFO_REMOVE,
    STUDENT_INFO_REMOVE_SUCCESS,
    STUDENT_INFO_REMOVE_FAILURE,
} from './ActionTypes';

import axios from 'axios';

/* GET Student Info */
export function getStudentsInfoRequest(classname) {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(getStudentsInfo());

        let url = '/api/teacher/getStudentsInfo';
        return axios.get(url)
        .then((response) => {
            dispatch(getStudentsInfoSuccess(response.data.info));
        })
        .catch((error) => {
            dispatch(getStudentsInfoFailure());
        });
    };
}

export function getStudentsInfo() {
    return {
        type: GET_STUDENTS_INFO
    };
}

export function getStudentsInfoSuccess(data) {
    return {
        type: GET_STUDENTS_INFO_SUCCESS,
        data
    };
}

export function getStudentsInfoFailure(error) {
    return {
        type: GET_STUDENTS_INFO_FAILURE,
        error
    };
}

/* Students EDIT */
export function studentsInfoEditRequest(id, index, obj) {
    return (dispatch) => {
        dispatch(studentsInfoEdit());
        return axios.put('/api/student/' + id, {obj})
        .then((response) => {
            dispatch(studentsInfoEditSuccess(id, index, response.data.std));
        }).catch((error) => {
            dispatch(studentsInfoEditFailure(error.response.data.code));
        });
    };
}

export function studentsInfoEdit() {
    return {
        type: STUDENT_INFO_EDIT
    };
}

export function studentsInfoEditSuccess(id, index, data) {
    return {
        type: STUDENT_INFO_EDIT_SUCCESS,
        index,
        data
    };
}

export function studentsInfoEditFailure(error) {
    return {
        type: STUDENT_INFO_EDIT_FAILURE,
        error
    };
}

/* CLASS REMOVE */
export function studentsInfoRemoveRequest(id, index) {
    return (dispatch) => {
        dispatch(studentsInfoRemove());
        return axios.delete('/api/student/' + id)
        .then((response) => {
            dispatch(studentsInfoRemoveSuccess(index));
        }).catch((error) => {
            dispatch(studentsInfoRemoveFailure());
        });
    };
}

export function studentsInfoRemove() {
    return {
        type: STUDENT_INFO_REMOVE
    };
}

export function studentsInfoRemoveSuccess(index) {
    return {
        type: STUDENT_INFO_REMOVE_SUCCESS,
        index
    };
}

export function studentsInfoRemoveFailure(error) {
    return {
        type: STUDENT_INFO_REMOVE_FAILURE,
        error
    };
}