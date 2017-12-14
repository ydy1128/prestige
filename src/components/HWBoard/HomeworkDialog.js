import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import {Editor, EditorState, ContentState, RichUtils, Modifier} from 'draft-js';

let style = {
  editorStyle: {
    width: '100%',
    height: '300px'
  }
};

class HomeworkDialog extends React.Component {
  constructor(props) {
    super(props);
    let {hw, closeDialog, dialogOn} = props;
    let content = Object.keys(hw).length ? hw.content : '';
    this.state = {
      status: hw.id ? "modify" : "create",
      contents: hw || {// initial contents
      	title: "String",
      	content: "String",
      	downloads: ["String"],
      	// uploads: ,
      	accomplishments: ["String"],
      	dueDate: "String",
      	writtenDate: "String",
      	modifiedDate: "String",
      	teacherId: "String",
      },
      editorState: EditorState.createWithContent(ContentState.createFromText(content)),
    };

    this._updateOnClick = this._updateOnClick.bind(this);
    this._cancleOnClick = this._cancleOnClick.bind(this);
    this._handleHomeworkPost = this._handleHomeworkPost.bind(this);
    this._dateOnChange = this._dateOnChange.bind(this);
    this._onChangeTextArea = this._onChangeTextArea.bind(this);
    this._handleTab = this._handleTab.bind(this);
  }

  render() {
    let { dialogOn } = this.props;
    let { contents } = this.state;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this._cancleOnClick}
      />,
      <FlatButton
        label="Update"
        primary={true}
        onClick={this._updateOnClick}
      />,
    ];

    let date = contents.dueDate ? new Date(contents.dueDate) : new Date();
    return (
      <div>
        <Dialog
          title="숙제"
          actions={actions}
          modal={false}
          open={dialogOn}
          onRequestClose={this._cancleOnClick}
        >

          <TextField id="homework-title"
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
          /><br />
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
          </div>

          <DatePicker id="due-date"
            hintText="Landscape Dialog"
            mode="landscape"
            defaultDate={date}
            onChange={this._dateOnChange}
          />

          <div id="accomplishments" > </div>
          <div id="upload" > </div>

          The actions in this window were passed in as an array of React objects.
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
    if(this.state.status == "modify") {
      //let content = editorState.getCurrentContent().getPlainText()

    } else {
      this._handleHomeworkPost(this.state.contents);
    }
    this.props.closeDialog();
  }

  _cancleOnClick(e) {
    this.props.closeDialog();
  }

  _handleHomeworkPost(contents){
      return this.props.homeworkPostRequest(contents).then(
          () => {
              console.log(this.props.homeworkPostStatus.status)
              if(this.props.homeworkPostStatus.status === "SUCCESS") {
                  Materialize.toast('수업이 개설 되었습니다!', 2000);
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
                          $toastContent = $('<span style="color: #FFB4BA">모든 정보를 채워주세요.</span>');
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

export default connect(mapStateToProps, undefined)(HomeworkDialog);
