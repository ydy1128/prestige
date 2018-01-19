import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    board: {
        status: 'INIT',
        data: []
    },
    post: {
        status: 'INIT',
        error: -1
    },
    edit:{
        status: 'INIT',
        error: -1,
    },
    remove: {
        status: 'INIT',
        error: -1
    }
}

export default function lecture(state, action) {
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.LECTURE_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.LECTURE_POST_SUCCESS:
        	console.log('actions: '+action.data)
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
        case types.LECTURE_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.LECTURE_BOARD:
            return update(state, {
                board: {
                    status: { $set: 'WAITING' },
                }
            });
        case types.LECTURE_BOARD_SUCCESS: 
        	console.log('SUCCESS');
            return update(state, {
                board: {
                    status: { $set: 'SUCCESS' },
                    data: { $set: action.data }
                }
            })
        case types.LECTURE_BOARD_FAILURE:
            return update(state, {
                board: {
                    status: { $set: 'FAILURE' }
                }
            })
        case types.LECTURE_EDIT: 
            return update(state, {
                edit: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 },
                }
            });
        case types.LECTURE_EDIT_SUCCESS:
            return update(state, {
                edit: {
                    status: { $set: 'SUCCESS' },
                },
                board: {
                    data: {
                        [action.index]: { $set: action.lecture }
                    }
                }
            });
        case types.LECTURE_EDIT_FAILURE:
            return update(state, {
                edit: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        case types.LECTURE_REMOVE:
            return update(state, {
                remove: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.LECTURE_REMOVE_SUCCESS:
            return update(state, {
                remove:{
                    status: { $set: 'SUCCESS' }
                }
            });
        case types.LECTURE_REMOVE_FAILURE:
            return update(state, {
                remove: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        default:
            return state;
    }
}