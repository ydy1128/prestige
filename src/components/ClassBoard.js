import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { ClassObj } from 'components';

class ClassBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {
            selected: [],
            plus_active: true
        }

        this.getPlusActive = this.getPlusActive.bind(this);
        this.activateModal = this.activateModal.bind(this);
        this.getClick = this.getClick.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
	}
    handleRemove(){
        if(!this.state.plus_active){
            let props = this.props;
            let selected = [...this.state.selected];
            let student_ids = [];

            this.state.selected.map(function(obj, i){
                student_ids = [...student_ids, ...obj.data.students];
                props.onRemove(obj.data._id, obj.index);
            });
            for (let i = 0; i < student_ids.length; i++){
                let std_idx = this.props.studentsData.findIndex(x => x._id == student_ids[i]);
                let std_obj = this.props.studentsData[std_idx]
                std_obj.class = '';
                props.onStudentEdit(std_obj._id, std_idx, std_obj).then(() =>{})
                // console.log(std_obj)
            }
            this.setState({
                selected: [],
                plus_active: true
            })
        }
    }
    getClick(data, index, selected){
        let selected_array = [...this.state.selected];
        let plus_active = true;

        if(selected){
            if(selected_array.findIndex(x => x.index==index) == -1){
                selected_array.push({data: data, index: index});
            }
        }
        else{
            console.log(selected_array, index)
            let idx = selected_array.findIndex(x => x.index==index);
            if(idx != -1){
                selected_array.splice(idx, 1);
            }
        }

        if(selected_array.length > 0){
            plus_active = false;
        }
        else{
            plus_active = true;
        }
        this.setState({
            selected: selected_array,
            plus_active: plus_active
        })
    }
    getPlusActive(plus_button){
        if(plus_button){
            return this.state.plus_active? '':'inactive';
        }
        else{
            return this.state.plus_active? 'inactive':'';
        }
    }
    activateModal(){
        if(this.state.plus_active)
            return 'modal-trigger';
        else
            return ''
    }
	render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div className="col m4"><h4>수업관리</h4></div>
                <div className="icons col m8">
                    <a onClick={this.handleRemove}>
                        <FontAwesome className={'remove-button right ' + this.getPlusActive(false)} name="trash-o" />
                    </a>
                    <a className={this.activateModal()} href="#classInfoModal">
                        <FontAwesome className={'plus-button right ' + this.getPlusActive(true)} name="plus" />
                    </a>
                </div>
            </div>
        )
        const mapToComponents = data => {
            return data.map((cls, i) => {
                return (<ClassObj ref={cls._id} 
                                    data={cls} 
                                    key={cls._id} 
                                    index={i} 
                                    getClick={this.getClick}/>);
            });
        };
        
		return(
            <div className="Boards">
                { boardHeader }
                <hr className="col m12"/>
	            <div className="Board-contents row">
	            	{mapToComponents(this.props.data)}
	            </div>
            </div>
		)
	}
}

ClassBoard.propTypes = {
    data: React.PropTypes.array,
    currentUser: React.PropTypes.string,
    onRemove: React.PropTypes.func,
};

ClassBoard.defaultProps = {
    data: [],
    currentUser: '',
    onRemove: (id, index) => { console.error('remove function not defined'); }
};


export default ClassBoard;