import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Dropzone from 'react-dropzone';
import { log } from 'util';

class HomeworkBoard extends React.Component {
  constructor(props) {
    super(props)
    let {hw, selectedHwIndex} = props;

    let hwFileNames = hw.files;
    let hwFiles = this.getHwFilesWithHwFileNames(hwFileNames);
    let contents = Object.assign({}, hw, { files: hwFiles });

    this.state = {
      isStudent: this.props.userRole == 'teacher' ? false : true,
      index: selectedHwIndex,
      contents,
      dropzoneActive: false,
      isFileChanged: false
    };
  }

  getHwFilesWithHwFileNames(fileNames) {
    var xhr = new XMLHttpRequest();

    return fileNames.map((fileName) => {
      let path = "uploads/" + this.props.hw._id + '/' + fileName;
      xhr.open("GET", path, false);  // true 면 async
      xhr.send(null)
      return new File([xhr.response], fileName, {type: 'image/jpg'});
    });
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {
    var style = {
      containerStyle: { padding: '16px', boxSizing: 'border-box', height: '548px' },
      editorStyle: {
        position: 'relative',
        width: '100%',
        height: '300px',
        cursor: 'text',
        backgroundColor: '#fefefe',
        resize: 'none',
        border: 'none',
        outline: 'none',
        WebkitBoxShadow: 'none',
        MozBoxShadow: 'none',
        boxShadow: 'none'
      }
    };

    return (
      <Paper style={style.containerStyle}> 
        {this.showBoardHeaderWith(this.state.contents)}
        <textarea 
          style={style.editorStyle}
          onKeyDown={this.handleTapOnWritingContent}
          placeholder="숙제 내용을 입력하세요."
          onChange={this.changeContent.bind(this)}
          value={this.state.contents.content}
          disabled={this.state.isStudent ? "disabled" : ""}
        />
        <div id="accomplishments" > </div>
        {this.showFileUploadSection()}
      </Paper>
    );
  }

  openFileSelectionWindowByClickDropzone(e) {
    this.dropzoneRef.onClick(e);
  }

  showBoardHeaderWith(contents) {
    var style = {
      hwBoardHeadStyle: { 
        position: 'relative', display: 'flex', 
        justifyContent: 'space-between', height: '86px' },
      titleStyle : { 
        flex: '0 0 300px' , 
        cursor: this.state.isStudent ? '' : 'inherit'
      },
      datePickerContainerStyle : { flex: '0 0 100px' },
      datePickerStyle: { 
        width: '120px', 
        fontSize: '16px', 
        cursor: this.state.isStudent ? '' : 'inherit'
      },
    };
    console.log('isStudent', this.props.isStudent);
    return (
      <div id="hw-board-head" style={style.hwBoardHeadStyle}>
        <TextField id="homework-title"
          style={style.titleStyle}
          hintText="제목"
          floatingLabelText="제목"
          value={contents.title}
          onChange={this.changeTitle.bind(this)}
          disabled={this.state.isStudent ? true : false}
          underlineShow={this.state.isStudent ? false : true}
        />
        <div style={style.datePickerContainerStyle}>
          <DatePicker id="due-date"
            floatingLabelText="제출 기한"
            textFieldStyle={style.datePickerStyle}
            hintText="Landscape Dialog"
            mode="landscape"
            defaultDate={contents.dueDate ? new Date(parseInt(contents.dueDate)) : new Date()}
            onChange={this.changeDate.bind(this)}
            disabled={this.state.isStudent ? true : false}
            underlineShow={this.state.isStudent ? false : true}
          />
        </div>
      </div>
    );
  }

  changeTitle(e) {
    this.setState({
      contents: Object.assign({}, this.state.contents, { title: e.target.value })
    });
  }

  changeContent(e) {
    this.setState({
      contents : Object.assign({}, this.state.contents, { content : e.target.value })
    });
  }

  handleTapOnWritingContent(e) {
    var TABKEY = 9;
    if(e.keyCode == TABKEY) {
      e.preventDefault();
      const tabCharacter = "    ";
      this.setState({
        contents : Object.assign({}, this.state.contents, {
          content : this.state.contents.content + tabCharacter
        })
      });
      e.target.focus();
    }
  }

  changeDate(e, date){
    let digitDate = Date.parse(date);
    this.setState({
      contents: Object.assign({}, this.state.contents, {dueDate: digitDate})
    });
  }

  uploadSelectedFilesOnServer(e) {
    let files = this.state.contents.files;
    let data = new FormData();
    
    for (let file of files) {
      data.append('file', file, file.name);
    }

    let config = {
      headers: { 'content-type': 'multipart/form-data' }
    }

    axios.post('/api/upload?hwId=' + this.props.hw._id, data, config).then(() => {
      Materialize.toast('첨부파일이 갱신되었습니다!', 2000);
      this.setState({
        isFileChanged : false
      });  
    });
  }

  updateHomeworkByIndex(index) {
    if (this.state.isFileChanged) {
      var $toastContent = $('<span style="color: #FFB4BA">첨부파일 구성이 변경되었습니다. <br />파일등록 버튼을 눌러주세요.</span>');
      Materialize.toast($toastContent, 2000);
      return;
    }
    let requestContent = Object.assign({}, this.state.contents);
    delete requestContent.files;
    
    this.props.homeworkEditRequest(requestContent._id, index, requestContent).then((status) => {
      this.props.closeBoard();
      if(status == "SUCCESS") {
        if(this.props.isNewHomework) {
          Materialize.toast('숙제가 추가되었습니다!', 2000);
        } else {
          Materialize.toast('숙제가 갱신되었습니다!', 2000);
        }
      } else { 
        this._handleError(this.props.homeworkEditState.error); 
      }
    });
  }

  _handleError(error) {
    let $toastContent = null;
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

  showFileUploadSection(props) {
    let style = {
      uploadSection : { height: '100px', display: 'flex', flexDirection : "column" },
      uploadSectionHeader : {display: 'flex', flex:'0 0 36px', justifyContent:'space-between'},
      uploadSectionTitle : {color: "gray"},
      uploadSectionButtons: {display: this.state.isStudent ? 'none' : ''},
      fileDropZoneContainer : {position: "relative", flex: '1'},
      fileDropZone : {width:"100%", height:"100%"},
      deleteButton : {display: this.state.isStudent ? 'none' : ''},
    };

    return (
      <div id="upload-section" style={style.uploadSection}>
        <div id="upload-section-header" style={style.uploadSectionHeader}>
          <div id="upload-section-title" style={style.uploadSectionTitle} >첨부 파일</div>
          <div style={style.uploadSectionButtons}>
            <FlatButton label="파일선택"
              onClick={this.openFileSelectionWindowByClickDropzone.bind(this)} />
            <FlatButton label="파일등록" primary={this.state.isFileChanged}
              onClick={this.uploadSelectedFilesOnServer.bind(this)} />
          </div>
        </div>
        <div className="dropzone" style={style.fileDropZoneContainer}>
          <Dropzone ref={(node) => { this.dropzoneRef = node; }}
            disable={this.state.isStudent ? true : false}
            style={style.fileDropZone}
            onDrop={this.appendFiles.bind(this)}
            onDragEnter={this.activateDropzone.bind(this)}
            onDragLeave={this.deactivateDropzone.bind(this)} >
            <div style={{position: 'absolute', left: 0, top:0, width:"100%", height:"100%",overflow: "scroll", backgroundColor: this.state.dropzoneActive ? "#aaaaaa" : "#f1f1f1"}}>
              { this.state.contents.files.map((f, idx) => {
                  var href = f.preview ? f.preview : "uploads/" + this.props.hw._id + '/' + f.name; 
                  return (
                    <div key={f.name}> 
                      <a download target="_blank" 
                        href={href} onClick={(e) => {e.stopPropagation();}} >{f.name} - {f.size} bytes </a>
                      <a style={style.deleteButton}onClick={this.deleteFile(idx).bind(this)}> x </a> 
                    </div>
                  )
                })
              } 
            </div>
          </Dropzone>
        </div>
      </div>
    );
  }

  appendFiles(accepted, rejected) {
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

  activateDropzone(e) {
      this.setState({
          dropzoneActive: true
      });
  }

  deactivateDropzone(e) {      
      this.setState({
          dropzoneActive: false
      });
  }

  deleteFile(index) {
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
    homeworkPostState: homework.post,
    homeworkEditState: homework.edit
  };
};

export default connect(mapStateToProps, undefined)(HomeworkBoard);
