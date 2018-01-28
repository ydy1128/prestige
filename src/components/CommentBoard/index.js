import React from "react";
import contain from './Container';

import FontAwesome from 'react-fontawesome';

// SUBCOMPONENTS
import Paper from 'material-ui/Paper';

var Present = ({ props, state, style, functions }) => {
    let {  } = props;
    let { } = state;
    let { } = functions;

    // STYLE
    let containerStyle = {
        width: '100%',
        height: '100%',
        position: 'relative',
    };

    let cssStyle =
    <style jsx >{ // put CSS style here
        `
            #paper-container {
                height: 100%;
            }

        `
    }</style>
    
    return (
        <div id='comment-board' style={containerStyle}>
            {cssStyle}
            <div id="paper-container" className="Board-contents row">
                <div className="col m12">
                    <Paper id="comment-paper"> 
                        <div id="comment-header" >
                            comments
                        </div>
                        <div id="post-comment">
                            커멘트 작성 및 root comments에 추가
                        </div>
                        <div id="root-comments">
                        </div>
                        
                    </Paper>
                </div>
            </div>
        </div>
    )
}
export default contain(Present)
