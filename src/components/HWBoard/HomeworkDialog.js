import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import {Editor, EditorState, ContentState, RichUtils, Modifier} from 'draft-js';
import Dropzone from 'react-dropzone';

let style = {
  dialogHeadStyle: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    height: '86px'
  },
  datePickerContainerStyle: {
    flex: '0 0 100px'
  },
  datePickerStyle: {
    width: '120px',
    fontSize: '16px',
    // marginTop: '24px',
  },
  titleStyle: {
    flex: '0 0 300px',
  },
  editorStyle: {
    position: 'relative',
    width: '100%',
    height: '300px',
    cursor: 'text'

  },
  editorOverlayStyle: {
    opacity: 0.2,
    position: 'absolute',
    top: 0,
    right: 0,
    userSelect: 'none',
    cursor: 'none',
  }
};

class HomeworkDialog extends React.Component {
  constructor(props) {
    super(props)
    let {hw, closeDialog, dialogOn, selectedHwIndex} = props;
    let content = hw ? hw.content : '';
    this.state = {
      mode: hw ? "update" : "create",
      index: selectedHwIndex,
      contents: hw || {// initial contents
        title: null,
        files: [],
        accomplishments: [],
        dueDate: Date.parse(new Date()),
        writtenDate: null,
        modifiedDate: null,
        teacherId: "TODO teacherId",
      },
      files:[],
      editorState: EditorState.createWithContent(ContentState.createFromText(content)),
    };

    this._updateOnClick = this._updateOnClick.bind(this);
    this._cancleOnClick = this._cancleOnClick.bind(this);
    this._handleHomeworkPost = this._handleHomeworkPost.bind(this);
    this._handleHomeworkEdit = this._handleHomeworkEdit.bind(this);
    this._dateOnChange = this._dateOnChange.bind(this);
    this._onChangeTextArea = this._onChangeTextArea.bind(this);
    this._handleTab = this._handleTab.bind(this);
    this._showUpload = this._showUpload.bind(this);
    this._onDrop = this._onDrop.bind(this);
  }

  render() {
    let { dialogOn } = this.props;
    let { contents, editorState, mode } = this.state;
    let {title} = contents;

    console.log(this.state.files);

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this._cancleOnClick}
      />,
      <FlatButton
        label={mode}
        primary={true}
        onClick={this._updateOnClick}
        disabled={!title || !editorState.getCurrentContent().getPlainText()}
      />,
    ];


    let dueDate = contents.dueDate ? new Date(parseInt(contents.dueDate)) : new Date();
    console.log(new Date(contents.dueDate));

    return (
      <div>
        <Dialog
          actions={actions}
          modal={false}
          open={dialogOn}
          onRequestClose={this._cancleOnClick}
        >
          <div id="dialog-head" style={style.dialogHeadStyle}>
            <TextField id="homework-title"
              style={style.titleStyle}
              hintText="Title"
              floatingLabelText="Title"
              value={contents.title}
              onChange={
                (e) => {
                  this.setState({
                    contents: Object.assign({}, contents, {title: e.target.value})
                  });
                }
              }
            />
            <div style={style.datePickerContainerStyle}>
              <DatePicker id="due-date"
                floatingLabelText="Due Date"
                textFieldStyle={style.datePickerStyle}
                hintText="Landscape Dialog"
                mode="landscape"
                defaultDate={dueDate}
                onChange={this._dateOnChange}
              />
            </div>
          </div>
          <div
            style={style.editorStyle}
            onClick= {(e) => {
              this.domEditor.focus()
            }}
          >
            <Editor
              editorState={this.state.editorState}
              onChange={this._onChangeTextArea}
              placeholder="Put your content..."
              onTab={this._handleTab}
              ref={ref => this.domEditor = ref}
            />
            <div style={style.editorOverlayStyle}> content </div>
          </div>

          <div id="accomplishments" > </div>
          <div id="upload" >
            {this._showUpload()}
          </div>
        </Dialog>
      </div>
    );
  }
  _onChangeTextArea(editorState) {
    this.setState({editorState})
  };

  _handleTab(e) {
    e.preventDefault();
    const tabCharacter = "    ";
    let currentState = this.state.editorState;
    let newContentState = Modifier.replaceText(
      currentState.getCurrentContent(),
      currentState.getSelection(),
      tabCharacter
    );

    this.setState({
      editorState: EditorState.push(currentState, newContentState, 'insert-characters')
    });
  }

  _dateOnChange(e, date){
    let digitDate = Date.parse(date);
    this.setState({
      contents: Object.assign({}, this.state.contents, {dueDate: digitDate})
    });
  }

  _updateOnClick(e) {
    let { mode, contents, index, editorState} = this.state;
    let requestContent = Object.assign({}, contents, {
      content: editorState.getCurrentContent().getPlainText()
    })
    if (mode == 'create') {
      requestContent.writtenDate = Date.now() + "";
      this._handleHomeworkPost(requestContent);
    } else if ( mode == 'update' ){
      this._handleHomeworkEdit(contents._id, index, requestContent);
    }
    this.props.closeDialog();

    // Fileupload
    let data = new FormData();
    let i = 1;
    for (let file of this.state.files) {
      data.append('file', file, file.name);
    }

    const config = {
        headers: { 'content-type': 'multipart/form-data' }
    }

    return axios.post('/api/upload', data, config);
  }

  _cancleOnClick(e) {
    this.props.closeDialog();
  }

  _handleHomeworkPost(contents){
    this.props.homeworkPostRequest(contents).then(
      () => {
        console.log(this.props.homeworkPostStatus)
        if(this.props.homeworkPostStatus == "SUCCESS") {
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

  _handleHomeworkEdit(id, index, content){
    let result = this.props.homeworkEditRequest(id, index, content).then(() => {
      if(this.props.homeworkPostStatus == "SUCCESS") {
        Materialize.toast('숙제가 갱신되었습니다!', 2000);
      }
      else {
        let $toastContent;
        switch(this.props.homeworkEditStatus.error) {
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
    });
  }

  _showUpload(props) {
    return(
      <section style={{position: 'relative'}}>
        <div className="dropzone">
          <Dropzone ref={(node) => { this.dropzoneRef = node; }}
            style={{width:"100%", height:"100px"}}
            onDrop={this._onDrop.bind(this)}
            >
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
        <aside style={{position: 'absolute', left: 0, top:0}}>
          <ul>
            {
              this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    )
  }

  _onDrop(files) {
    this.setState({
      files
    });
  }

}

const mapStateToProps = (state) => {
  let homework = state.homework;
  return {
    homeworkPostStatus: homework.post.status,
    homeworkEditStatus: homework.edit.status,
  };
};

export default connect(mapStateToProps, undefined)(HomeworkDialog);
