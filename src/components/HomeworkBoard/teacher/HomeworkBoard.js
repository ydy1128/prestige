import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import {Editor, EditorState, ContentState, RichUtils, Modifier} from 'draft-js';
import Dropzone from 'react-dropzone';
import { log } from 'util';

let style = {
  containerStyle: {
    padding: '16px',
    boxSizing: 'border-box',
    height: '518px'
  },
  hwBoardHeadStyle: {
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
    cursor: 'text',
    backgroundColor: '#fefefe'

  }
};

class HomeworkBoard extends React.Component {
  constructor(props) {
    super(props)
    let { hw, selectedHwIndex} = props;
    var xhr = new XMLHttpRequest();
    let hwId = hw._id;
    // file path를 바탕으로 File object를 만듦
    let contents = Object.assign({}, hw, {files: hw.files.length ? hw.files.map((fileName) => {
      let path = "uploads/" + hw._id + '/' + fileName;
      xhr.open("GET", path, false);  // true 면 async
      xhr.send(null)
      return new File([xhr.response], fileName)
    }) : [] });

    this.state = {
      index: selectedHwIndex,
      contents,
      hwId,
      editorState: EditorState.createWithContent(ContentState.createFromText(contents.content)),
      dropzoneActive: false,
      isFileChanged: false,
      dialog: {
        title: '',
        status: false,
        content: '',
      }
    };

    this._handleHomeworkEdit = this._handleHomeworkEdit.bind(this);
    this._dateOnChange = this._dateOnChange.bind(this);
    this._onChangeTextArea = this._onChangeTextArea.bind(this);
    this._handleTab = this._handleTab.bind(this);
    this._showUpload = this._showUpload.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onDelete = this._onDelete.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {
    let {contents, editorState} = this.state;
    let {title} = contents; 
    let dueDate = contents.dueDate ? new Date(parseInt(contents.dueDate)) : new Date();

    return (
      <Paper style={style.containerStyle}> 
        <div id="hw-board-head" style={style.hwBoardHeadStyle}>
          <TextField id="homework-title"
            style={style.titleStyle}
            hintText="제목"
            floatingLabelText="제목"
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
              floatingLabelText="제출 기한"
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
            editorState={editorState}
            onChange={this._onChangeTextArea}
            placeholder="숙제 내용을 입력하세요..."
            onTab={this._handleTab}
            ref={ref => this.domEditor = ref}
          />
        </div>

        <div id="accomplishments" > </div>
        <div id="upload" style={{height: '100px', display: 'flex', flexDirection: "column"}}>
          <div id="upload-header" style={{display: 'flex', flex:'0 0 36px', justifyContent:'space-between'}}>
            <div style={{color: "gray"}} >첨부</div>
            <div>
              <FlatButton
                label="파일선택"
                onClick={(e) => {
                  this.dropzoneRef.onClick(e);
                }}
              />
              <FlatButton
                label="파일등록"
                primary={this.state.isFileChanged}
                onClick={this._uploadFile.bind(this)}
              />
            </div>
          </div>
          {this._showUpload()}
          {this._showDialog()}
        </div>
      </Paper>
    );
  }

  _onChangeTextArea(editorState) {
    this.setState({editorState});
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

  _uploadFile() {
    let files = this.state.contents.files;
    // Fileupload
    let data = new FormData();
    for (let file of files) {
      data.append('file', file, file.name);
    }

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }

    this.setState({
      isFileChanged : false
    });

    return axios.post('/api/upload?hwId=' + this.props.hw._id , data, config);
  }

  updateHomework(index) {
    let {contents, editorState} = this.state;
    let content = editorState.getCurrentContent().getPlainText();
    console.log('t', content);
    let requestContent = Object.assign({}, contents, { content });
    delete requestContent.files;
    this._handleHomeworkEdit(contents._id, index, requestContent);
  }

  _handleHomeworkEdit(id, index, content){
    let result = this.props.homeworkEditRequest(id, index, content).then(() => {
      if(this.props.homeworkEditStatus == "SUCCESS") {
        if(this.props.isNewHomework) {
          Materialize.toast('숙제가 추가되었습니다!', 2000);
        } else {
          Materialize.toast('숙제가 갱신되었습니다!', 2000);
        }
      } else { this._handleError(this.props.homeworkEditStatus.error) }
    });
  }

  _handleError(error) {
    let $toastContent;

    switch(error) {
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

  _showUpload(props) {
    return(
      <div className="dropzone" style={{position: "relative", flex: '1'}}>
        <Dropzone ref={(node) => { this.dropzoneRef = node; }}
          style={{width:"100%", height:"100%"}}
          onDrop={this._onDrop.bind(this)}
          onDragEnter={this._onEnter.bind(this)}
          onDragLeave={this._onDragLeave.bind(this)}
          >
          <div style={{position: 'absolute', left: 0, top:0, width:"100%", height:"100%",overflow: "scroll", backgroundColor: this.state.dropzoneActive ? "#aaaaaa" : "#f1f1f1"}}>
            {
              this.state.contents.files.map( (f, idx) => <div key={f.name}>{f.name} - {f.size} bytes <a onClick={this._onDelete(idx)}> x </a> </div>)
            }
          </div>
        </Dropzone>
      </div>
    )
  }

  _showDialog(dialog) {
    
    return (
      <Dialog
        title="Dialog With Actions"
        // actions={actions}
        modal={false}
        open={this.state.dialog.status}
        onRequestClose={(e) => {
          this.setState({dialog: {status:false}});
        }}
      >
        The actions in this window were passed in as an array of React objects.
      </Dialog>
    )
  }

  _onDrop(accepted, rejected) {
    let files = accepted;
    let newFiles = [...this.state.contents.files];
    for (let file of files) {
        let hasSameName = false;
        this.state.contents.files.map((stateFile, index) => {
            if(stateFile.name == file.name) {
                newFiles[index] = file;
                hasSameName = true;
            }
        });
        if(!hasSameName){
            newFiles.push(file);
        }
    }
    this.setState({ 
      contents: Object.assign({}, this.state.contents, {files: newFiles}), 
      dropzoneActive: false,
      isFileChanged: newFiles.length != this.state.contents.files.length
    });
  }

  _onEnter(e) {
      this.setState({
          dropzoneActive: true
      });
  }

  _onDragLeave(e) {      
      this.setState({
          dropzoneActive: false
      });
  }

  _onDelete(index) {
    return (e) => {
      e.stopPropagation()
      let files = this.state.contents.files;
      let newFiles = [...files.slice(0,index), ...files.slice(index+1, files.length)]
      this.setState({
        contents: Object.assign({}, this.state.contents, {files: newFiles}),
        isFileChanged: true,
    })
    }
  }

}

const mapStateToProps = (state) => {
  let homework = state.homework;
  return {
    homeworkPostStatus: homework.post.status,
    homeworkEditStatus: homework.edit.status,
  };
};

export default connect(mapStateToProps, undefined)(HomeworkBoard);
