import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

let style = {
};

class DeleteDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this._deleteOnClick = this._deleteOnClick.bind(this);
        this._cancleOnClick = this._cancleOnClick.bind(this);
    }

    render() {
        let { dialogOn } = this.props;
        // let { } = this.state;

        const actions = [
            <FlatButton
                label="Delete"
                primary={true}
                onClick={this._deleteOnClick}
            />,
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this._cancleOnClick}
            />,
        ];

        return (
          <div>
            <Dialog
              title="경고"
              actions={actions}
              modal={false}
              open={dialogOn}
              onRequestClose={this._cancleOnClick}
            >
                지워진 숙제는 복구할수 없습니다.
                <br/>
                숙제를 지우시겠습니까?
            </Dialog>
          </div>
        );
    }

    _deleteOnClick(e) {
        this.props.deleteHomeworks();
        this.props.closeDialog();
    }

    _cancleOnClick(e) {
        this.props.closeDialog();
    }

}

const mapStateToProps = (state) => {
    let homework = state.homework;
    return {
        homeworkPostStatus: homework.post.status,
    };
};

export default connect(mapStateToProps, undefined)(DeleteDialog);
