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
import Comments from './Comments';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class EditHomeworkBoard extends React.Component {
  constructor(props) {
    super(props)
    let { hw, selectedHwIndex } = props;
    let homeworkId = hw._id;
    let files = getHwFilesWithHwFileNamesByHomeworkId(homeworkId, hw.fileNames);

    this.state = {
      isStudent: this.props.userInfo.role == 'teacher' ? false : true,
      index: selectedHwIndex,
      contents: hw,
      files,
      dropzoneActive: false,
      className: (this.props.classData.find((item) => hw.classId == item._id)).name
    };
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {
    var style = {
      container: {marginTop: 20},
      homeworkBody : { 
        padding: '16px', 
        boxSizing: 'border-box', 
        height: '548px',
        backgroundColor: 'white' 
      },
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
      <div className="col m12" style={style.container}>
        <div style={style.homeworkBody}> 
          {this.showBoardHeaderWith(this.state.contents)}
          <textarea 
            style={style.editorStyle}
            onKeyDown={this.handleTapOnWritingContent.bind(this)}
            placeholder={this.state.isStudent ? "" : "숙제 내용을 입력하세요."}
            onChange={this.changeContent.bind(this)}
            value={this.state.contents.content}
            disabled={this.state.isStudent ? "disabled" : ""}
          />
          <div id="accomplishments" > </div>
          {this.showFileUploadSection()}
        </div>
        <Comments 
          key={this.props.hw._id} 
          homeworkId={this.props.hw._id}/>
      </div>
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
      titleStyle : { flex: '0 0 300px' },
      datePickerContainerStyle : { flex: '0 0 100px' },
      datePickerStyle: { width: '120px', fontSize: '16px' },
    };

    if (this.state.isStudent) {
      style.titleStyle.color ='black';
      style.titleStyle.cursor ='';
      style.datePickerStyle.color ='black';
      style.datePickerStyle.cursor ='';
    }

    return (
      <div id="hw-board-head" style={style.hwBoardHeadStyle}>
        <TextField id="homework-title"
          inputStyle={style.titleStyle}
          hintText="제목"
          floatingLabelText="제목"
          value={contents.title}
          onChange={this.changeTitle.bind(this)}
          disabled={this.state.isStudent ? true : false}
          underlineShow={this.state.isStudent ? false : true}
        />
        {this.state.isStudent ?
          <TextField
            inputStyle={style.titleStyle}
            hintText="수업"
            floatingLabelText="수업"
            value={this.state.className}
            disabled={true}
            underlineShow={false}
          />
          :
          <SelectField
            floatingLabelText={'수업'}
            value={this.state.className}
            onChange={this.state.isStudent ? null : this.changeClass.bind(this)}
          >
            {this.props.classData.map(classItem => (
              <MenuItem value={classItem.name} primaryText={classItem.name} />))}
          </SelectField>
      }

        <div style={style.datePickerContainerStyle}>
          <DatePicker id="due-date"
            floatingLabelText="제출 기한"
            textFieldStyle={style.datePickerStyle}
            inputStyle={style.datePickerStyle}
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

  changeClass(e, index, name) {
    console.log(this.props.classData[index]._id);
    this.setState({
      className: name,
      contents: Object.assign({}, this.state.contents, { classId: this.props.classData[index]._id })
    });
  };

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
          </div>
        </div>
        <div className="dropzone" style={style.fileDropZoneContainer}>
          <Dropzone ref={(node) => { this.dropzoneRef = node; }}
            disableClick={this.state.isStudent ? true : false}
            style={style.fileDropZone}
            onDrop={this.appendFiles.bind(this)}
            onDragEnter={this.activateDropzone.bind(this)}
            onDragLeave={this.deactivateDropzone.bind(this)} >
            <div style={{position: 'absolute', left: 0, top:0, width:"100%", height:"100%",overflow: "scroll", backgroundColor: this.state.dropzoneActive ? "#aaaaaa" : "#f1f1f1"}}>
              { this.state.files.map((f, idx) => {
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

  changeDate(e, date){
    let digitDate = Date.parse(date);
    this.setState({
      contents: Object.assign({}, this.state.contents, {dueDate: digitDate})
    });
  }

  updateHomeworkByIndex(index) {
    if (!this.state.contents.title) {
      let $toastContent = $('<span style="color: #FFB4BA">제목을 입력하세요.</span>');
      Materialize.toast($toastContent, 2000);
      return;
    }
    let contents = Object.assign({}, this.state.contents, {fileNames: this.state.files.map( file => file.name )});

    this.props.homeworkEditRequest(contents._id, index, contents).then((response) => {
        Materialize.toast('숙제가 갱신되었습니다!', 2000);
        this.uploadSelectedFilesOnServerByHomeworkId(contents._id);
        this.props.closeBoard();
      }, (error) => { 
        this._handleError(this.props.homeworkEditState.error); 
        this.props.closeBoard();
      }
    );
  }

  uploadSelectedFilesOnServerByHomeworkId(homeworkId) {
    let files = this.state.files;
    if (files.length == 0) { return; }
    let data = new FormData();
    for (let file of files) {
      data.append('file', file, file.name);
    }

    let config = { headers: { 'content-type': 'multipart/form-data' } };
    axios.post('/api/upload?hwId=' + homeworkId, data, config).then(() => {
      Materialize.toast('첨부파일이 갱신되었습니다!', 2000);
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

  appendFiles(accepted, rejected) {
    let files = accepted;
    let newFiles = [...this.state.files];
    for (let file of files) {
      let hasSameName = false;
      this.state.files.map((stateFile, index) => {
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
      files: newFiles,
      dropzoneActive: false,
    });
  }

  deleteFile(index) {
    return (e) => {
      e.stopPropagation()
      let files = this.state.files;
      let newFiles = [...files.slice(0,index), ...files.slice(index+1, files.length)];
      this.setState({
        files: newFiles
      });
    }
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
}

function getHwFilesWithHwFileNamesByHomeworkId(homeworkId, fileNames) {
  var xhr = new XMLHttpRequest();

  return fileNames.map((fileName) => {
    let path = "uploads/" + homeworkId + '/' + fileName;
    xhr.open("GET", path, false);  // true 면 async
    xhr.send(null)
    return new File([xhr.response], fileName, {type: 'image/jpg'});
  });
}

const mapStateToProps = (state) => {
  let homework = state.homework;
  return {
    homeworkPostState: homework.post,
    homeworkEditState: homework.edit,
    classData: state.makeclass.board.data,
  };
};

export default connect(mapStateToProps, undefined)(EditHomeworkBoard);
