import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    getStudents: {
        status: 'INIT',
        data: []
    },
    editStudents: {
        status: 'INIT',
        error: -1,
    },
    pwChange: {
        status: 'INIT',
        error: -1,
    },
    removeStudents: {
        status: 'INIT',
        error: -1,
    },
}


export default function studentinfo(state, action) {
    
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.GET_STUDENTS_INFO:
            return update(state, {
                getStudents: {
                    status: { $set: 'WAITING' },
                }
            });
        case types.GET_STUDENTS_INFO_SUCCESS: 

            return update(state, {
                getStudents: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data }
                }
            })
        case types.GET_STUDENTS_INFO_FAILURE:
            return update(state, {
                getStudents: {
                    status: { $set: 'FAILURE' }
                }
            })
        case types.STUDENT_INFO_EDIT: 
            return update(state, {
                editStudents: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.STUDENT_INFO_EDIT_SUCCESS:
            return update(state, {
                editStudents: {
                    status: { $set: 'SUCCESS' },
                },
                getStudents: {
                    data: {
                        [action.index] : { $set: action.data }
                    }
                }
            });
            
        case types.STUDENT_INFO_EDIT_FAILIURE:
            return update(state, {
                editStudents: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.STUDENT_INFO_PW_CHANGE: 
            return update(state, {
                pwChange: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.STUDENT_INFO_PW_CHANGE_SUCCESS:
            console.log(action)
            return update(state, {
                pwChange: {
                    status: { $set: 'SUCCESS' },
                }
            });
            
        case types.STUDENT_INFO_PW_CHANGE_FAILIURE:
            return update(state, {
                pwChange: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.STUDENT_INFO_REMOVE:
            return update(state, {
                removeStudents: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.STUDENT_INFO_REMOVE_SUCCESS:
            return update(state, {
                removeStudents:{
                    status: { $set: 'SUCCESS' }
                },
                getStudents: {
                    data: { $splice: [[action.index, 1]] }
                }
            });
        case types.STUDENT_INFO_REMOVE_FAILURE:
            return update(state, {
                removeStudents: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        default:
            return state;
    }
}