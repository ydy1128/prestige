import React from "react";
import contain from './Container';

import FontAwesome from 'react-fontawesome';

import demoData from './demoData';

// SUBCOMPONENTS
import Paper from 'material-ui/Paper';

var Present = ({ props, state, style, functions }) => {
    let { comments } = props;
    let { } = state;
    let { } = functions;
    comments = comments || demoData;

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
            #paper-container {
                height: 100%;
            }

        `
    }</style>
    
    return (
        <Paper id="comment-paper" style={containerStyle}>
            {cssStyle}
            <div id="comments-header" >
                comments
            </div>
            <div id="comments-board">
                {
                    comments.map((comment) => null
                    )       
                }
            </div>
            <div id="commnet-poster">
                
            </div>
        </Paper>
    )
}
export default contain(Present)
