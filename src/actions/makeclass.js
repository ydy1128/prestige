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
    CLASS_BOARD,
    CLASS_BOARD_SUCCESS,
    CLASS_BOARD_FAILURE,
    CLASS_POST,
    CLASS_POST_SUCCESS,
    CLASS_POST_FAILURE,
    CLASS_EDIT_PREP,
    CLASS_EDIT,
    CLASS_EDIT_SUCCESS,
    CLASS_EDIT_FAILURE,
    CLASS_REMOVE,
    CLASS_REMOVE_SUCCESS,
    CLASS_REMOVE_FAILURE
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


/* Class Board */
export function classBoardRequest(isInitial, listType, id, username) {
    return (dispatch) => {
        dispatch(classBoard());

        let url = '/api/class';

        return axios.get(url)
        .then((response) => {
            dispatch(classBoardSuccess(response.data, isInitial, listType));
        }).catch((error) => {
            dispatch(classBoardFailure());
        });
    };
}

export function classBoard() {
    return {
        type: CLASS_BOARD
    };
}

export function classBoardSuccess(data, isInitial, listType) {
    return {
        type: CLASS_BOARD_SUCCESS,
        data,
        isInitial,
        listType
    };
}

export function classBoardFailure() {
    return {
        type: CLASS_BOARD_FAILURE
    };
}

/*Class Post*/
export function classPostRequest(contents) {
    return (dispatch) => {
        dispatch(classPost());

        return axios.post('/api/class', { contents })
        .then((response) => {
            console.log(response.data.data)
            dispatch(classPostSuccess(response.data.data));
        }).catch((error) => {
            dispatch(classPostFailure(error.response.data.code));
        });
    };
}

export function classPost() {
    return {
        type: CLASS_POST
    };
}

export function classPostSuccess(data) {
    return {
        type: CLASS_POST_SUCCESS,
        data
    };
}

export function classPostFailure(error) {
    return {
        type: CLASS_POST_FAILURE,
        error
    };
}

/* Class Edit */
export function classEditPrep(name, days, starttime, endtime, index, _id, students, flag){
    return {
        type: CLASS_EDIT_PREP,
        name,
        days,
        starttime,
        endtime,
        index,
        _id,
        students,
        flag
    };
}

export function classEditRequest(id, index, contents) {
    return (dispatch) => {
        dispatch(classEdit());

        return axios.put('/api/class/' + id, { contents })
        .then((response) => {
            dispatch(classEditSuccess(index, response.data.cls));
        }).catch((error) => {
            dispatch(classEditFailure(error.response.data.code));
        });
    };
}

export function classEdit() {
    return {
        type: CLASS_EDIT
    };
}

export function classEditSuccess(index, cls) {
    return {
        type: CLASS_EDIT_SUCCESS,
        index,
        cls
    };
}

export function classEditFailure(error) {
    return {
        type: CLASS_EDIT_FAILURE,
        error
    };
}

/* CLASS REMOVE */
export function classRemoveRequest(id, index) {
    return (dispatch) => {
        dispatch(classRemove());
        return axios.delete('/api/class/' + id)
        .then((response) => {
            dispatch(classRemoveSuccess(index));
        }).catch((error) => {
            dispatch(classRemoveFailure());
        });
    };
}

export function classRemove() {
    return {
        type: CLASS_REMOVE
    };
}

export function classRemoveSuccess(index) {
    return {
        type: CLASS_REMOVE_SUCCESS,
        index
    };
}

export function classRemoveFailure(error) {
    return {
        type: CLASS_REMOVE_FAILURE,
        error
    };
}
