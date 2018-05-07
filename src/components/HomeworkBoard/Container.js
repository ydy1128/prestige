import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

// ACTIONS
import {
  homeworkBoardRequest,
  homeworkPostRequest,
  homeworkEditRequest,
  homeworkRemoveRequest 
} from 'actions/homework';

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
      homeworkRemoveRequest: (id) => {
        return dispatch(homeworkRemoveRequest(id));
      }
    };
  };

  var contain = (Present)  => {
    class Container extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          createBoardOn: false,
          editBoardOn: false,

          deleteDialogOn: false,
          selectedHw: null,
          selectedHwIndex: null,

          filteredClick: [],
          searchOpen: false,
          searchText: '',
          searchResult: [],
        };
      }

      render() {
        let presentState = [
          "createBoardOn",
          "editBoardOn",

          "deleteDialogOn", 
          "selectedHw", 
          "selectedHwIndex",
          
          "searchOpen",
          "searchText",
          "searchResult",
          "filteredClick",
        ];
        let presentProps = [
          "hwData",
          "userInfo"
        ];
        let customProps = {
        };
        let presentFunctions = {
          homeworkPostRequest: this.props.homeworkPostRequest.bind(this),
          homeworkEditRequest: this.props.homeworkEditRequest.bind(this),
          deleteHomeworks: this._deleteHomeworks.bind(this),
          handleRowSelection: this._handleRowSelection.bind(this),
          onClickEditHomework: this._onClickEditHomework.bind(this),
          onClickCreateHomework: this._onClickCreateHomework.bind(this),
          closeBoard: this.closeBoard.bind(this),
          toggleDeleteDialog: this._toggleDeleteDialog.bind(this),
          focusSearchInput: this._focusSearchInput.bind(this),
          blurSearchInput: this._blurSearchInput.bind(this),
          onSearchEngineChange:this._onSearchEngineChange.bind(this),
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
        this._loadHomeworkData();
      }

      componentWillReceiveProps(nextProps) {}

      // shouldComponentUpdate(nextProps, nextState) { return true }

      componentWillUpdate(nextProps, nextState) {}

      componentDidMount() {}

      componentDidUpdate() {}

      componentWillUnmount() {}

      // CUSTOM FUNCTIONS
      closeBoard() {
        this._loadHomeworkData();
        this.setState({
          createBoardOn: false,
          editBoardOn: false,
        })
      }

      _onClickCreateHomework(e) {
        this.setState({
          createBoardOn: true,
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
            editBoardOn: true
          })
        }
      }

      _handleRowSelection(rowIds) {
        this.setState({
          filteredClick: rowIds
        });
      }

      _deleteHomeworks() {
        let {filteredClick, searchResult} = this.state;
        let targetHwData = searchResult.length != 0 ? searchResult : this.props.hwData;
        let desSortedIndexes = filteredClick.sort((a,b)=>{return a<b});
        for(var targetIndex of desSortedIndexes){
          let targetId = targetHwData[targetIndex]._id;
          this.props.homeworkRemoveRequest(targetId);
        }
        this.props.homeworkBoardRequest().then(() => {});
        this.setState({
          filteredClick: []
        })
      }

      _loadHomeworkData(){
        this.props.homeworkBoardRequest().then(() => {});
      }

      _focusSearchInput(){
        this.setState({searchOpen: true});
      }

      _blurSearchInput(){
          this.setState({searchOpen: false})
          if(this.state.searchText == '')
              this.setState({searchText: '', filteredClick: []});
      }

      _onSearchEngineChange(event, value) {
        let hwData = [];
        let filteredClick = [];
        if(value == ''){
            this.setState({searchOpen: true, searchResult: [], filteredClick, searchText: ''});
        }
        else{
          this.props.hwData.map((hw, i) =>{
            let push = false;
            let obj = hw;
            obj.index = i;

            if(obj.title.includes(value)) push = true;
            if(obj.content.includes(value)) push = true;
            if(push) hwData.push(obj);
          });
          if(this.state.filteredClick.lenth != 0){
              for(let i = 0; i < this.state.filteredClick.length; i++){
                  let filteredIndex = hwData.indexOf(this.props.hwData[this.state.filteredClick[i]]);
                  if(filteredIndex != -1){
                      filteredClick.push(filteredIndex);
                  }
              }
          }
          this.setState({
            searchOpen: true, 
            searchResult: hwData, 
            filteredClick: filteredClick, 
            searchText: value
          });
        }
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
