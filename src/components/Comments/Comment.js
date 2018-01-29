import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

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

class DeleteDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props.comment, {
            onEdit: false
        })
    }

    render() {
        // let {editedDate, name, type, id, content}
        return (
            <div style={containerStyle}>
                {cssStyle}
                <div className="comment-header"> 
                    <div className="name-comment"></div>
                    <div className="date-comment"></div>
                    <div className="edit-button-comment"></div>
                    <div className="delete-button-comment"></div>
                </div>
                <div className="content-comment"></div>
                
            </div>
        );
    }

    
}

const mapStateToProps = (state) => {
    let homework = state.homework;
    return {
        homeworkPostStatus: homework.post.status,
    };
};

export default connect(mapStateToProps, undefined)(DeleteDialog);
