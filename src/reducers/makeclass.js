import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    board: {
        status: 'INIT',
        data: [],
    },
    post: {
        status: 'INIT',
        error: -1
    },
    editClassPrep: {
        name: '',
        days: '',
        starttime: '',
        endtime: '',
        students: '',
        index: '',
        _id: '',
        flag: true
    },
    editClass: {
        status: 'INIT',
        error: -1,
    },
    removeClass: {
        status: 'INIT',
        error: -1
    }
};

export default function makeclass(state, action) {
    
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.CLASS_BOARD:
            return update(state, {
                board: {
                    status: { $set: 'WAITING' },
                }
            });
        case types.CLASS_BOARD_SUCCESS: 
            return update(state, {
                board: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data },
                }
            })
            return state;
        case types.CLASS_BOARD_FAILURE:
            return update(state, {
                board: {
                    status: { $set: 'FAILURE' }
                }
            })
        case types.CLASS_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.CLASS_POST_SUCCESS:
            return update(state, {
                post: {
                    status: { $set: 'SUCCESS' }
                },
                board: {
                    data: {
                        $push: [action.data]
                    }
                }
            });
        case types.CLASS_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.CLASS_EDIT_PREP:
            return update(state, {
                editClassPrep: {
                    name: { $set: action.name },
                    days: { $set: action.days },
                    starttime: { $set: action.starttime },
                    endtime: { $set: action.endtime },
                    students: { $set: action.students },
                    index: { $set: action.index },
                    _id: { $set: action._id },
                    flag: { $set: action.flag }
                }
            });
        case types.CLASS_EDIT: 
            return update(state, {
                editClass: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 },
                    cls: { $set: undefined }
                }
            });
        case types.CLASS_EDIT_SUCCESS:
            return update(state, {
                editClass: {
                    status: { $set: 'SUCCESS' },
                },
                board: {
                    data: {
                        [action.index]: { $set: action.cls }
                    }
                }
            });
        case types.CLASS_EDIT_FAILURE:
            return update(state, {
                editClass: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.CLASS_REMOVE:
            return update(state, {
                removeClass: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.CLASS_REMOVE_SUCCESS:
            return update(state, {
                removeClass:{
                    status: { $set: 'SUCCESS' }
                },
                board: {
                    data: { $splice: [[action.index, 1]] }
                }
            });
        case types.CLASS_REMOVE_FAILURE:
            return update(state, {
                removeClass: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        default:
            return state;
    }
}