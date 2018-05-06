import React from "react";
import contain from './Container';
import FontAwesome from 'react-fontawesome';
import Paper from 'material-ui/Paper';
import Comment from './Comment';

var Present = ({ props, state, style, functions }) => {
    let { comments } = props;
    let { newComment } = state;
    let { appendComment, changeNewComment } = functions;
        
    // STYLE
    let containerStyle = {
        marginTop: '16px',
        marginBottom: '16px',
        width: '100%',
        height: '400px',
        position: 'relative',
        padding: '16px'
    };

    let cssStyle =
    <style jsx >{ // put CSS style here
        `
            #comments-board {
                height: auto;
                max-height: 250px;
                overflow: scroll;
            }

            #comments-header {
                font-family: HYSUPM;
                font-size: 16px;
                height: 32px;
                margin-bottom: 10px;
            }

            #comments-header:before {
                content:"";
                display: float;
                height: 32px;
                vertical-align: middle;
                padding: 5px; 
                margin-right: 5px;
                color:#fff; background: #86272d;
            } 
            #comment-poster {
                display: flex;
                flex-direction: row;
                height: 62px;
                margin-bottom: 10px
            }
            #comment-poster-textarea {
                width: calc(100% - 62px);
                height: 62px;
                fontSize: 12px;
                resize: none;
            }
            .comment-post-button {
                cursor: pointer;
                width: 62px;
                line-height: 62px;
                text-align: center;
            }
            .comment-post-button:hover {
                background-color: gray;
            }
        `
    }</style>
    return (
        <Paper id="comment-paper" style={containerStyle}>
            {cssStyle}
            <div id="comments-header" > Comments </div>
            
            <div id="comment-poster">
                <textarea 
                    id="comment-poster-textarea"
                    placeholder="이곳에 댓글을 입력하세요."
                    onChange={changeNewComment}
                    value={newComment}
                />
                <div className="comment-post-button" 
                    onClick={appendComment}>Post</div>
            </div>

            <div id="comments-board">
                { 
                    comments.map((comment) => 
                        <Comment key={comment._id} 
                            comment={comment}/>)
                }
            </div>
        </Paper>
    )
}
export default contain(Present)
