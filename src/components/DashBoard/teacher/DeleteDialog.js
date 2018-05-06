import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


class DeleteDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this._deleteOnClick = this._deleteOnClick.bind(this);
        this._cancleOnClick = this._cancleOnClick.bind(this);
    }

    render() {
        let { dialogOn, objName, objNum } = this.props;

        const actions = [
            <FlatButton
                label="삭제"
                primary={true}
                onClick={this._deleteOnClick}
            />,
            <FlatButton
                label="취소"
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
                삭제시 복구할수 없습니다.
                <br/>
                {objNum == 0 ? '' : objNum + '개의 '}{objName} 지우시겠습니까?
            </Dialog>
          </div>
        );
    }

    _deleteOnClick(e) {
        this.props.deleteFunction();
        this.props.closeDialog();
    }

    _cancleOnClick(e) {
        this.props.closeDialog();
    }

}

DeleteDialog.defaultProps = {
    objName: '',
    objNum: 0,

}


export default DeleteDialog;
