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
            <Paper id="comment-paper"> 
                <div id="comment-header" >
                    comments
                </div>
                <div id="comment-board">
                    {
                        comments.map((comment) => null
                        )       
                    }
                </div>
                <div id="commnet-poster"></div>
            </Paper>
        </div>
    )
}
export default contain(Present)
