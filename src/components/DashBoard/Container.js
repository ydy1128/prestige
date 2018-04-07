import React from "react";
import { connect } from 'react-redux';

import { postMemoListRequest, editMemoListRequest, removeMemoListRequest } from 'actions/memolist';
import { postMemoGroupRequest, getMemoGroupRequest, editMemoGroupRequest, removeMemoGroupRequest, removeMemoGroupsByListRequest } from 'actions/memogroup';

import throwError from 'components/commons/throwError';

var container = (Present) =>{
	class Container extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                dialogOpen: false,
                dialogMode: 0,
                dialogEditMode: false,
                remove_active: false,
                clicked: [],
                currList: {
                    name: ''
                },
                currGroup: {
                    name: '',
                    memoList: -1,
                },
                currMemo: {
                    dueDate: '',
                    label: '-1',
                    text: '',
                    memoGroup: -1,
                },
            }
            this.getMemoGroup = this.getMemoGroup.bind(this);
            this.openDialog = this.openDialog.bind(this);
            this.closeDialog = this.closeDialog.bind(this);
            this.toggleDialog = this.toggleDialog.bind(this);
            this.toggleMode = this.toggleMode.bind(this);
            this.toggleEditMode = this.toggleEditMode.bind(this);
            this.backAction = this.backAction.bind(this);
            this.handleDialogDataChange = this.handleDialogDataChange.bind(this);
            this.handlePost = this.handlePost.bind(this);
            this.handleEdit = this.handleEdit.bind(this);
            this.handleRemove = this.handleRemove.bind(this);
            this.handleListClick = this.handleListClick.bind(this);
        }
        render(){
            let presentState = ['dialogOpen', 'dialogMode', 'dialogEditMode', 'remove_active', 'clicked', 'currList', 'currGroup', 'currMemo'];
            let presentProps = [];
            let customProps = {
                memoListData: this.props.memoListData,
                memoGroupData: this.props.memoGroupData,

            };
            let presentFunctions = {
                getMemoGroup: this.getMemoGroup, 
                openDialog: this.openDialog, 
                closeDialog: this.closeDialog, 
                toggleMode: this.toggleMode,
                backAction: this.backAction,
                handleDialogDataChange: this.handleDialogDataChange, 
                handlePost: this.handlePost, 
                handleEdit: this.handleEdit, 
                handleRemove: this.handleRemove, 
                handleListClick: this.handleListClick, 
            }

        	return(
                <Present  
                    props={{...(_.pick(this.props, presentProps)), ...customProps}}
                    state={_.pick(this.state, presentState)}
                    functions={presentFunctions}
                />
        	)
        }
        getMemoGroup(id){
            this.props.getMemoGroupRequest(id).then(() => {
                console.log('memoGroupData: ', this.props.memoGroupData);
            })
        }
        openDialog(mode, index, editmode, event){
            console.log('openDialog, mode: ', mode, 'index: ', index);
            this.toggleDialog(true);
            this.toggleMode(mode, index);
            this.toggleEditMode(editmode);  
        }
        closeDialog(){
            this.toggleDialog(false);
            // console.log(this.state.currGroup)
            if(this.state.dialogMode == 2)
                this.toggleMode(1, this.state.currGroup.memoList);
            switch (this.state.dialogMode) {
                case 0:
                    this.setState({currList: {name: ''}});
                    break;
                case 1:
                case 2:
                    this.setState({currGroup: {name: ''}, currMemo: {dueDate: '',label: '-1',text: ''}});
                    break;
            }
            this.setState({remove_active: false, clicked: []});
        }
        toggleDialog(open){
            this.setState({dialogOpen: open})
        }
        toggleMode(mode, index){
            if(index != undefined){
                if(this.state.dialogMode == 0 && mode == 0){
                    let currList = Object.assign({}, this.props.memoListData[index]);
                    currList.index = index;
                    this.setState({currList: currList});
                }
                else if(this.state.dialogMode == 0 && mode == 1){
                    let currList = Object.assign({}, this.props.memoListData[index]);
                    let currGroup = Object.assign({}, this.state.currGroup);
                    currList.index = index;
                    currGroup.memoList = currList._id;
                    this.setState({currList: currList, currGroup: currGroup});
                }
                else if(this.state.dialogMode == 1 && mode == 1){
                    let currGroup = Object.assign({}, this.props.memoGroupData[index]);
                    currGroup.index = index;
                    this.setState({currGroup: currGroup});
                }
                else if(this.state.dialogMode == 1 && mode == 2){
                    let currGroup = Object.assign({}, this.state.currGroup);
                    console.log(currGroup)
                    let currMemo = Object.assign({}, currGroup.memos[index]);
                    this.setState({currMemo: currMemo})
                }
            }
            this.setState({dialogMode: mode});
        }
        toggleEditMode(mode){
            this.setState({dialogEditMode: mode})
        }
        backAction(){
            if(this.state.dialogMode > 0){
                this.setState({dialogMode: --this.state.dialogMode});
            }
            this.setState({currGroup: {name: ''}, currList: {name: ''}});
        }
        handleDialogDataChange(event, value, curObj){
            let nextState = {};
            nextState[curObj] = this.state[curObj];
            nextState[curObj][event.target.name] = value;
            this.setState(nextState);
        }
        handlePost(contents){
            switch(this.state.dialogMode){
                case 0:
                    return this.props.postMemoListRequest(contents).then(() =>{
                        if(this.props.memoListPostStatus.status === 'SUCCESS'){
                            Materialize.toast('보드가 생성 되었습니다!', 2000);
                            this.closeDialog();
                        }
                        else{
                            return throwError(false, '보드', this.props.memoListPostStatus.error, '');
                        }    
                    });
                case 1:
                    return this.props.postMemoGroupRequest(contents).then(() =>{
                        if(this.props.memoGroupPostStatus.status === 'SUCCESS'){
                            Materialize.toast('메모그룹이 생성 되었습니다!', 2000);
                            this.closeDialog();
                        }
                        else{
                            return throwError(false, '메모그룹', this.props.memoGroupPostStatus.error, '');
                        }    
                    });
                case 2:
                    let currGroup = this.state.currGroup;
                    contents.memoGroup = currGroup.index;
                    currGroup.memos.push(contents);
                    return this.props.editMemoGroupRequest(currGroup.index, currGroup).then(() => {
                        if(this.props.memoGroupEditStatus.status === 'SUCCESS'){
                            Materialize.toast('메모가 생성 되었습니다!', 2000);
                            this.closeDialog();
                        }
                        else{
                            return throwError(false, '메모', this.props.memoGroupEditStatus.error, '');
                        }    
                    })
            }
        }
        handleEdit(contents){
            switch(this.state.dialogMode){
                case 0:
                    return this.props.editMemoListRequest(contents.index, contents).then(() => {
                        if(this.props.memoListEditStatus.status === 'SUCCESS'){
                            Materialize.toast('보드가 수정 되었습니다!', 2000);
                            this.closeDialog();
                        }
                        else{
                            return throwError(false, '보드', this.props.memoListEditStatus.error, '');
                        }
                    })
                    break;
                case 1:
                    return this.props.editMemoGroupRequest(contents.index, contents).then(() => {
                        if(this.props.memoGroupEditStatus.status === 'SUCCESS'){
                            Materialize.toast('메모그룹이 수정 되었습니다!', 2000);
                            this.closeDialog();
                        }
                        else{
                            return throwError(false, '메모그룹', this.props.memoGroupEditStatus.error, '');
                        }    
                    })
                    break;
                case 2:
                    let currGroup = this.state.currGroup;
                    for(var i = 0; i < currGroup.memos.length; i++){
                        if(contents._id == currGroup.memos[i]._id){
                            currGroup.memos[i] = contents;
                        }
                    }
                    return this.props.editMemoGroupRequest(currGroup.index, currGroup).then(() => {
                        if(this.props.memoGroupEditStatus.status === 'SUCCESS'){
                            Materialize.toast('메모가 수정 되었습니다!', 2000);
                            this.closeDialog();
                        }
                        else{
                            return throwError(false, '메모', this.props.memoGroupEditStatus.error, '');
                        }    
                    })
                    break;
            } 
        }
        handleRemove(id, index){
            switch(this.state.dialogMode){
                case 0:
                    return this.props.removeMemoListRequest(id, index).then(() => {
                        if(this.props.memoListRemoveStatus.status === 'SUCCESS'){
                            Materialize.toast('보드가 삭제 되었습니다!', 2000);
                            this.props.removeMemoGroupsByListRequest(id, index).then(() =>{
                                if(this.props.removeMemoGroupsByListStatus.status){
                                    this.closeDialog();
                                }
                                else{
                                    return throwError(false, '보드', this.props.removeMemoGroupsByListStatus.error, '');
                                }
                            });
                        }
                        else{
                            return throwError(false, '보드', this.props.memoListRemoveStatus.error, '');
                        }
                    })
                    break;
                case 1:
                    // console.log(id, index);
                    return this.props.removeMemoGroupRequest(id, index).then(() => {
                        if(this.props.memoGroupRemoveStatus.status === 'SUCCESS'){
                            Materialize.toast('메모그룹가 삭제 되었습니다!', 2000);
                            this.closeDialog();
                        }
                        else{
                            return throwError(false, '메모', this.props.memoGroupRemoveStatus.error, '');
                        }
                    })
                    break;
                case 2:
                    let currGroup = this.state.currGroup;
                    console.log(currGroup)
                    for(var i = 0; i < currGroup.memos.length; i++){
                        if(id == currGroup.memos[i]._id){
                            currGroup.memos.splice(i, 1);
                        }
                    }
                    return this.props.editMemoGroupRequest(currGroup.index, currGroup).then(() => {
                        if(this.props.memoGroupEditStatus.status === 'SUCCESS'){
                            Materialize.toast('메모가 삭제 되었습니다!', 2000);
                            this.closeDialog();
                        }
                        else{
                            return throwError(false, '메모', this.props.memoGroupEditStatus.error, '');
                        }    
                    })
                    break;
            }
        }
        handleListClick(clicked, event){
            let clicked_array = [...this.state.clicked];
            let remove_active = false;
            // event.preventDefault();
            event.stopPropagation();

            let index = parseInt(event.target.name.split('-')[1]);
            let index_in_clicked = clicked_array.findIndex(x => x == index);
            if(!clicked){
                clicked_array.push(index);
            }
            else{
                clicked_array.splice(index_in_clicked, 1);
            }

            if(clicked_array.length > 0){
                remove_active = true;
            }
            else{
                remove_active = false;
            }
            this.setState({
                clicked: clicked_array,
                remove_active: remove_active
            })
        }
    }
	return connect(mapStateToProps, mapDispatchToProps)(Container);
}
const mapDispatchToProps = (dispatch) => {
    return {
        postMemoListRequest: (contents) => {
            return dispatch(postMemoListRequest(contents));
        },
        editMemoListRequest: (index, contents) => {
            return dispatch(editMemoListRequest(index, contents));
        },
        removeMemoListRequest: (id, index) => {
            return dispatch(removeMemoListRequest(id, index));
        },

        postMemoGroupRequest: (contents) => {
            return dispatch(postMemoGroupRequest(contents));
        },
        editMemoGroupRequest: (index, contents) => {
            return dispatch(editMemoGroupRequest(index, contents));
        },

        getMemoGroupRequest: (_id) => {
            return dispatch(getMemoGroupRequest(_id));
        },
        removeMemoGroupRequest: (id, index) =>{
            return dispatch(removeMemoGroupRequest(id, index));
        },
        removeMemoGroupsByListRequest: (id, index) =>{
            return dispatch(removeMemoGroupsByListRequest(id, index));
        } 
    }
}

const mapStateToProps = (state) => {
    return {
        memoListPostStatus: state.memolist.post,
        memoListEditStatus: state.memolist.edit,
        memoListRemoveStatus: state.memolist.remove,

        memoGroupPostStatus: state.memogroup.post,
        memoGroupEditStatus: state.memogroup.edit,
        memoGroupRemoveStatus: state.memogroup.remove,
        removeMemoGroupsByListStatus: state.memogroup.removelist,

        memoGroupData: state.memogroup.get.data,
    }
}
export default container;