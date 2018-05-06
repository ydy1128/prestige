import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontAwesome from 'react-fontawesome';

import {
    updateCommentByComment,
    deleteCommentById
} from 'actions/comment';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.comment,
            onEdit: false
        };
    }

    render() {
        let style = {
            container: {
                width: '100%',
                height: '100%',
                position: 'relative',
                padding: '6px',
                borderTop: '#dddddd solid 0.5px',
                width: 'calc(100% - 62px)'
            },
            commentHeader: { display: 'flex', flexDirection: 'row' },
            nameComment: { font: 'bold 16px HYSUPM' },
            dateComment: { font: '12px HYSUPM', color: 'gray' }
        };

        let { _id, editedDate, writer, content } = this.state.comment;

        let date = new Date(parseInt(editedDate));

        return (
            <div style={style.container}>
                <div className="comment-header" style={style.commentHeader}> 
                    <div className="name-comment" style={style.nameComment}>
                        {writer.user.name + "    "}
                        <span className="date-comment" style={style.dateComment}>{date.toLocaleDateString() +' ' + date.toLocaleTimeString()}</span>
                    </div>
                    { 
                        this.props.userInfo.user._id == writer.user._id ?
                        this.showButtons() 
                        : null 
                    }
                </div>
                {
                    this.state.onEdit ?
                    <textarea onChange={(e)=>{
                            this.setState({
                                comment: Object.assign({},this.state.comment, {
                                    content: e.currentTarget.value
                                })
                            })
                        }}
                        value={this.state.comment.content}> </textarea>
                    :
                    <div className="content-comment">{content}</div>
                }
            </div>
        );
    }

    showButtons() {
        let style = {
            commentButton: { marginLeft: '10px' }
        };

        return [
            <a className="edit-comment-button comment-button"
                style={style.commentButton}
                key={"edit-comment-button-"+this.state.comment._id}
                onClick={
                    this.state.onEdit ?
                    this.updateComment.bind(this) :
                    this.turnEditOn.bind(this)
                }>
                <FontAwesome className={'comment-button-icon '} name={this.state.onEdit ? "upload" : "pencil"} />
            </a>,
            <a className="delete-comment-button comment-button"
                style={style.commentButton}
                key={"delete-comment-button-"+this.state.comment._id}
                onClick={this.deleteComment.bind(this)}>   
                <FontAwesome className={'comment-button-icon '} name="trash-o" />
            </a>
        ];
    }

    updateComment(e) {
        this.props.updateCommentByComment(this.state.comment);
        this.setState({onEdit:false});
    }

    deleteComment(e) {
        this.props.deleteCommentById(this.state.comment._id);
        this.setState({onEdit:false});
    }

    turnEditOn(e) {
        this.setState({onEdit:true});
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCommentByComment: (comment) => {
            return dispatch(updateCommentByComment(comment));
        },
        deleteCommentById: (commentId) => {
            return dispatch(deleteCommentById(commentId));
        },
    };
};

const mapStateToProps = (state) => {
    let homework = state.homework;
    return {
        homeworkPostStatus: homework.post.status,
        userInfo: state.authentication.status.currentUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
