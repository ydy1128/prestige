import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    data: [],
};

export default function comment(state = initialState, action) {
    switch(action.type) {
        case types.GET_COMMENTS:
            return update(state, {
                data: { $set: action.data },
            });

        case types.APPEND_COMMENT:
            return update(state, {
                data: { $push: [action.comment] }
            });

        case types.UPDATE_COMMENT: {
            let targetCommentIndexInComments = getTargetIndexByCommentIdInComments(action.comment._id, state.data);
            console.log(targetCommentIndexInComments);
            if (targetCommentIndexInComments !== null) {
                return update(state, {
                    data: { $splice: [[targetCommentIndexInComments, 1, action.comment]] }
                });    
            }
        }

        case types.DELETE_COMMENT:{
            let targetCommentIndexInComments = getTargetIndexByCommentIdInComments(action.commentId, state.data)
            if (targetCommentIndexInComments !== null) {
                return update(state, {
                    data: { $splice: [[targetCommentIndexInComments, 1]] }
                });
            }
        }

        case types.FLASH_COMMENTS:
            return update(state, {
                data: { $set: [] }
            });

        default:
            return state;
    }
}

function getTargetIndexByCommentIdInComments(id, comments) {
    let index = 0;
    for (let comment of comments) {
        if (comment._id == id) {
            return index;
        }
        index++;
    }
    return null;
}