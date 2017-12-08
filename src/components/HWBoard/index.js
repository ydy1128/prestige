import React from "react";
import contain from './Container';



import FlatButton from 'material-ui/FlatButton';
// style
import getStyleWith from './style';

// SUBCOMPONENTS

var Present = ({ props, state, style, functions }) => {
    let styles = getStyleWith(props) // Do not modify!!
    //let { } = props;
    //let { } = state;
    let { onClick } = functions;
    return (
        <div id='homework-section' style={styles.main}>
            <div id='homework-header' style={styles.header}>
                <div id='homework-title' style={styles.title}>숙제관리</div>
                <div id='homework-buttons' style={styles.buttons}>
                    <FlatButton label="Default" />
                </div>

            </div>
        </div>
    )
}

export default contain(Present)
