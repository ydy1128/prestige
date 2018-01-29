import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

// ACTIONS
import {
  homeworkBoardRequest,
  homeworkPostRequest,
  homeworkEditRequest,
  homeworkRemoveRequest } from 'actions/homework';

  // STORE
  function mapStateToProps (state) {
    let homework  = state.homework;
    return {
      hwData: homework.board.data,
      hwPostStatus: homework.post,
      hwEditStatus: homework.edit,
      hwRemoveStatus: homework.remove,
      userInfo: state.authentication.status.currentUser
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      homeworkBoardRequest: (id) => {
        return dispatch(homeworkBoardRequest(id));
      },
      homeworkPostRequest: (contents) => {
        return dispatch(homeworkPostRequest(contents));
      },
      homeworkEditRequest: (id, index, contents) => {
        return dispatch(homeworkEditRequest(id, index, contents));
      },
      homeworkRemoveRequest: (id, index) => {
        return dispatch(homeworkRemoveRequest(id, index));
      }
    };
  };

  var contain = (Present)  => {
    class Container extends React.Component {

      // CLASS INNER FUNCTIONS
      constructor(props) {
        super(props);
        this.state = {
          boardOn: false,
          clickedRowIndexes: [],
          selectedHw: null,
          deleteDialogOn: false,
          selectedHwIndex: null,
        };
        this._handleRowSelection = this._handleRowSelection.bind(this);
        this._deleteHomeworks = this._deleteHomeworks.bind(this);
        this._loadHomeworkData = this._loadHomeworkData.bind(this);
        this._onClickCreateHomework = this._onClickCreateHomework.bind(this);
        this._onClickEditHomework = this._onClickEditHomework.bind(this);
        this._closeBoard = this._closeBoard.bind(this);
        this._toggleDeleteDialog = this._toggleDeleteDialog.bind(this);
      }

      render() {
        let presentState = ["boardOn", "clickedRowIndexes", "selectedHw", "deleteDialogOn", "selectedHwIndex"];
        let presentProps = [
          "hwData"
        ];
        let customProps = {
        };
        let presentFunctions = {
          homeworkPostRequest: this.props.homeworkPostRequest,
          homeworkEditRequest: this.props.homeworkEditRequest,
          deleteHomeworks: this._deleteHomeworks,
          handleRowSelection: this._handleRowSelection,
          onClickEditHomework: this._onClickEditHomework,
          onClickCreateHomework: this._onClickCreateHomework,
          closeBoard: this._closeBoard,
          toggleDeleteDialog: this._toggleDeleteDialog,
        }

        return (  // Do not modify!!
          <Present
            props={{...(_.pick(this.props, presentProps)), ...customProps}}
            state={_.pick(this.state, presentState)}
            functions={presentFunctions}
          />
        )
      }

      // COMPONENT LIFE CYCLE
      componentWillMount() {
        console.log("this");
        this._loadHomeworkData();
      }

      componentWillReceiveProps(nextProps) {}

      // shouldComponentUpdate(nextProps, nextState) { return true }

      componentWillUpdate(nextProps, nextState) {}

      componentDidMount() {}

      componentDidUpdate() {}

      componentWillUnmount() {}

      // CUSTOM FUNCTIONS
      _closeBoard() {
        this.setState({
          boardOn: false
        })
      }

      _onClickCreateHomework(e) {
        let contents = {
          title: "",
          files: [],
          comments: [],
          content: "",
          accomplishments: [],
          dueDate: Date.parse(new Date()),
          writtenDate: Date.parse(new Date()),
          teacherId: this.props.userInfo.user._id,
        }

        this.props.homeworkPostRequest(contents).then( (res) => {
          this.setState({
            selectedHw: res.data.homework,
            selectedHwIndex: this.props.hwData.length,
            boardOn: true
          })
        });
     }

      _toggleDeleteDialog(open) {
        return (e) => {
          this.setState({
            deleteDialogOn: open
          })
        }
      }

      _onClickEditHomework(index) {
        return (e) => {
          e.stopPropagation();
          this.setState({
            selectedHw: this.props.hwData[index],
            selectedHwIndex: index,
            boardOn: true
          })
        }
      }

      _handleRowSelection(rowIds) {
        this.setState({
          clickedRowIndexes: rowIds
        })
      }

      _deleteHomeworks() {
        let targetHomeworkIndexes = this.state.clickedRowIndexes;
        let desSortedIndexes = targetHomeworkIndexes.sort((a,b)=>{return a<b})
        for(var targetIndex of desSortedIndexes){
          let targetId = this.props.hwData[targetIndex]._id;
          this.props.homeworkRemoveRequest(targetId, targetIndex);
        }

        this.setState({
          clickedRowIndexes: []
        })
      }

      _loadHomeworkData(){
        this.props.homeworkBoardRequest().then(() => {});
      }
    }


    // PROPS SETTING
    Container.propTypes = {
      values: PropTypes.array,
    }

    Container.defaultProps = {
      values: [1,3],
    }


    return connect(mapStateToProps, mapDispatchToProps)(Container);
  }


  export default contain
