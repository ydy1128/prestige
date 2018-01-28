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
            label="Cancel"
            primary={true}
            onClick={this._cancleOnClick}
          />,
          <FlatButton
            label="Delete"
            primary={true}
            onClick={this._deleteOnClick}
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

    _handleHomeworkPost(contents){
        return this.props.homeworkPostRequest(contents).then(
            () => {
                console.log(this.props.homeworkPostStatus.status)
                if(this.props.homeworkPostStatus === "SUCCESS") {
                    Materialize.toast('숙제가 등록되었습니다!', 2000);
                }
                else {
                    let $toastContent;
                    switch(this.props.homeworkPostStatus.error) {
                        case 1:
                        $toastContent = $('<span style="color: #FFB4BA">세션이 만료 되었습니다. <br />로그인 하세요.</span>');
                        Materialize.toast($toastContent, 2000);
                        setTimeout(()=> {location.reload(false);}, 2000);
                        break;
                        case 2:
                        $toastContent = $('<span style="color: #FFB4BA">모든 정보를채워주세요.</span>');
                        Materialize.toast($toastContent, 2000);
                        break;
                        default:
                        $toastContent = $('<span style="color: #FFB4BA">서버 에러 발생. <br /> 관리자에게 문의하세요.</span>');
                        Materialize.toast($toastContent, 2000);
                        break;
                    }

                }
            }
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
