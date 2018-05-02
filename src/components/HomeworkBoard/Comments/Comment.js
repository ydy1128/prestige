import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontAwesome from 'react-fontawesome';


// STYLE
let containerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    padding: '6px',
    borderTop: '#dddddd solid 0.5px',
    width: 'calc(100% - 62px)'
};

let cssStyle =
<style jsx >{ // put CSS style here
    `
        .comment-header {
            display: flex;
            flexDirection: row;
        }
        .name-comment {
            font: bold 16px HYSUPM;
        }
        .date-comment {
            font: 12px HYSUPM;
            color: gray;
        }
        .comment-button {
            margin-left: 10px;
        }

    `
}</style>

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props.comment, {
            comment: null,
            onEdit: false
        })
    }

    render() {
        if (!this.state.comment) {
            return null;
        }

        let {editedDate, writer, _id, content} = this.state.comment;
        let onEdit = this.state.onEdit;
        let buttons = [
            <a className="edit-comment-button comment-button"
                key={"edit-comment-button-"+this.state.commentId}
                onClick={
                    onEdit ?  
                    (e) => { 
                        this.props.update(_id, this.state.comment);
                        this.setState({onEdit:false});
                    } :
                    (e) =>{ this.setState({onEdit:true})}
                }
            >
                <FontAwesome className={'comment-button-icon '} name={this.state.onEdit ? "upload" : "pencil"} />
            </a>,
            <a className="delete-comment-button comment-button"
                key={"delete-comment-button-"+this.state.commentId}
                onClick={this.props.delete(_id)}
            >   
                <FontAwesome className={'comment-button-icon '} name="trash-o" />
            </a>
        ]

        let date = new Date(parseInt(editedDate));

        return (
            <div style={containerStyle}>
                {cssStyle}
                <div className="comment-header"> 
                    <div className="name-comment">{writer.user.name + "    "}
                        <span className="date-comment">{date.toLocaleDateString() +' ' + date.toLocaleTimeString()}</span>
                    </div>
                    { this.props.userInfo.user._id == writer.user._id ? buttons : null }
                </div>
                {
                    onEdit ?
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

    async componentWillMount() {
        let commentId = this.props.commentId;
        if(commentId){            
            let commentIds = JSON.stringify([commentId]);
            let comments = await axios.get('/api/comments?comments='+ commentIds ).then((res)=>{
                return res.data.comments
            });
            this.setState({ comment: comments.length ? comments[0] : null  });
        }
    }

    async componentWillReceiveProps(nextProps) {
        let commentIds = JSON.stringify([this.props.commentId]);
        let comments = await axios.get('/api/comments?comments='+ commentIds).then((res)=>{
            return res.data.comments
        });
        this.setState({ comment: comments.length ? comments[0] : null });
    }
}

const mapStateToProps = (state) => {
    let homework = state.homework;
    return {
        homeworkPostStatus: homework.post.status,
        userInfo: state.authentication.status.currentUser
    };
};

export default connect(mapStateToProps, undefined)(Comment);
